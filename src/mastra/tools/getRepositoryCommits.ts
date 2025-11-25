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

const outputSchema = z.union([
  z
    .object({
      ok: z.literal(true),
      commits: z
        .array(
          z.object({
            sha: z.string().describe("The SHA hash of the commit"),
            message: z.string().describe("The commit message"),
            date: z
              .string()
              .datetime()
              .nullish()
              .describe("The date of the commit"),
            url: z.string().url().describe("The URL to view the commit"),
            author: z
              .object({
                name: z.string().describe("The name of the author"),
                email: z.string().describe("The email of the author"),
                username: z
                  .string()
                  .optional()
                  .describe("The GitHub username of the author"),
                avatarUrl: z
                  .string()
                  .url()
                  .optional()
                  .describe("The URL of the author's avatar"),
                url: z
                  .string()
                  .url()
                  .optional()
                  .describe("The URL of the author's profile"),
              })
              .describe("The commit author information"),
            verified: z
              .boolean()
              .describe("Whether the commit signature is verified"),
          }),
        )
        .describe("List of commits"),
    })
    .describe("The success object"),
  z
    .object({
      ok: z.literal(false),
      message: z.string(),
    })
    .describe("The error/failed object"),
]);
export const getRepositoryCommits = createTool({
  id: "getRepositoryCommits",
  description: "List recent commits for a repository (limited to 100 commits to prevent rate limiting)",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { repo, owner } = context;

    try {
      // Cache commits for 5 minutes
      const cacheKey = `commits:${owner}/${repo}`;
      const response = await withCache(
        cacheKey,
        () => gh.rest.repos.listCommits({
          owner,
          repo,
          per_page: 100,
        }),
        5 * 60 * 1000 // 5 minutes
      );

      return {
        ok: true as const,
        commits: response.data.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          date: commit.commit.author?.date || commit.commit.committer?.date,
          url: commit.html_url,
          author: {
            name:
              commit.commit.author?.name ||
              commit.commit.committer?.name ||
              "Unknown",
            email:
              commit.commit.author?.email ||
              commit.commit.committer?.email ||
              "unknown",
            username: commit.author?.login || commit.committer?.login,
            avatarUrl:
              commit.author?.avatar_url || commit.committer?.avatar_url,
            url: commit.author?.html_url || commit.committer?.html_url,
          },
          verified: commit.commit.verification?.verified || false,
        })),
      };
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Unkown error",
      };
    }
  },
});
