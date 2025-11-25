import { gh } from "@/lib/octokit";
import { withCache } from "@/lib/github-cache";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const getFilePaths = createTool({
  id: "getFilePaths",
  description: "Get all file paths from the GitHub repository",
  inputSchema: z.object({
    owner: z
      .string()
      .describe("The owner of the repository. As facebook in facebook/react"),
    repo: z
      .string()
      .describe("The name of the repository. As react in facebook/react"),
    tree_sha: z
      .string()
      .describe("SHA or branch to start listing commits from")
      .default("main"),
  }),
  outputSchema: z.array(z.string()),
  execute: async ({ context }) => {
    const { owner, repo, tree_sha } = context;

    // Cache file paths for 15 minutes since repo structure doesn't change often
    const cacheKey = `tree:${owner}/${repo}:${tree_sha}`;
    const getTreeResponse = await withCache(
      cacheKey,
      () => gh.rest.git.getTree({
        owner,
        repo,
        recursive: "true",
        tree_sha,
      }),
      15 * 60 * 1000 // 15 minutes
    );

    return getTreeResponse.data.tree
      .map((file) => file.path)
      .filter(Boolean) as string[];
  },
});
