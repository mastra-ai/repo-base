/**
 * Simple in-memory cache for GitHub API responses to reduce rate limiting
 * Cache entries expire after a configurable TTL (default 5 minutes)
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class GitHubCache {
    private cache = new Map<string, CacheEntry<unknown>>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

    /**
     * Get cached data if it exists and hasn't expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        // Check if entry has expired
        if (Date.now() - entry.timestamp > this.defaultTTL) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set cached data
     */
    set<T>(key: string, data: T, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });

        // Optional: Set a timeout to auto-delete after TTL
        if (ttl !== undefined) {
            setTimeout(() => {
                this.cache.delete(key);
            }, ttl);
        }
    }

    /**
     * Clear all cached data
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys()),
        };
    }
}

// Export a singleton instance
export const githubCache = new GitHubCache();

/**
 * Helper function to wrap GitHub API calls with caching
 */
export async function withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
): Promise<T> {
    // Try to get from cache first
    const cached = githubCache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // If not in cache, fetch and cache the result
    const data = await fetchFn();
    githubCache.set(key, data, ttl);
    return data;
}

