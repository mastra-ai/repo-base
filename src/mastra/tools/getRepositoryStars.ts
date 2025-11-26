import { gh } from "@/lib/octokit";
import { withCache } from "@/lib/github-cache";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
});

export type GetRepositoryStarsArgs = z.infer<typeof inputSchema>;

const outputSchema = z.union([
  z.object({
    ok: z.literal(true),
    starCount: z.number().int().describe("The current number of stars"),
    createdAt: z.string().describe("When the repository was created"),
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export type GetRepositoryStarsResults = z.infer<typeof outputSchema>;

export const getRepositoryStars = createTool({
  id: "getRepositoryStars",
  description: "Get the current number of stars for a repository. Returns star count and creation date.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo } = context;

    try {
      // Fetch repository info which gives us the current star count in a SINGLE API call
      // Cache for 30 minutes since star counts don't change rapidly
      const cacheKey = `repo:${owner}/${repo}`;
      const repoInfo = await withCache(
        cacheKey,
        () => gh.rest.repos.get({
          owner,
          repo,
        }),
        30 * 60 * 1000 // 30 minutes
      );

      return {
        ok: true as const,
        starCount: repoInfo.data.stargazers_count,
        createdAt: repoInfo.data.created_at,
      };
    } catch (error) {
      console.error("Error fetching repository info:", error);
      return {
        ok: false as const,
        message:
          error instanceof Error ? error.message : "Failed to fetch repository info",
      };
    }
  },
});
