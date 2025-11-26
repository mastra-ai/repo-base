import { Octokit } from "octokit";

// Create Octokit instance with rate limit monitoring
export const gh = new Octokit({
    auth: process.env.GITHUB_TOKEN!,
    // Add request/response hooks for rate limit monitoring
    request: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hook: async (request: any, options: any) => {
            try {
                const response = await request(options);

                // Log rate limit information from response headers
                const remaining = response.headers['x-ratelimit-remaining'];
                const limit = response.headers['x-ratelimit-limit'];
                const reset = response.headers['x-ratelimit-reset'];

                if (remaining && limit) {
                    const remainingNum = parseInt(remaining as string);
                    const limitNum = parseInt(limit as string);
                    const percentUsed = ((limitNum - remainingNum) / limitNum * 100).toFixed(1);

                    // Warn when approaching rate limit (>80% used)
                    if (remainingNum < limitNum * 0.2) {
                        const resetTime = reset ? new Date(parseInt(reset as string) * 1000).toISOString() : 'unknown';
                        console.warn(`⚠️  GitHub API Rate Limit Warning: ${remaining}/${limit} remaining (${percentUsed}% used). Resets at ${resetTime}`);
                    }
                }

                return response;
            } catch (error) {
                // Check if this is a rate limit error
                if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
                    const errorObj = error as { status: number; response?: { headers?: Record<string, string> } };
                    const resetHeader = errorObj.response?.headers?.['x-ratelimit-reset'];
                    if (resetHeader) {
                        const resetTime = new Date(parseInt(resetHeader) * 1000);
                        console.error(`❌ GitHub API Rate Limit Exceeded! Resets at ${resetTime.toISOString()}`);
                    }
                }
                throw error;
            }
        },
    },
});
