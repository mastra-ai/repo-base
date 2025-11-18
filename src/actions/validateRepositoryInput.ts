"use server";

import { z } from "zod";
import { actionClient } from ".";
import { redirect } from "next/navigation";
import { gh } from "@/lib/octokit";
import { RepositoryError } from "./errors";
import { cookies } from "next/headers";

const RepositoryInputSchema = z
  .string()
  .trim()
  .min(3, "Repository input must be at least 3 characters")
  .transform((val) => {
    const trimmedValue = val.trim().toLowerCase();
    return trimmedValue;
  })
  .transform((val) => {
    try {
      const url = new URL(val);

      if (url.hostname.includes("github.com")) {
        const pathSegments = url.pathname.split("/").filter(Boolean);
        if (pathSegments.length === 2) {
          return { owner: pathSegments[0], repo: pathSegments[1] };
        }
      }
    } catch { }

    const parts = val.split("/").filter(Boolean);
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }

    return val;
  })
  .refine(
    (val) => {
      return typeof val === "object" &&
        val !== null &&
        "owner" in val &&
        typeof val.owner === "string" &&
        "repo" in val &&
        typeof val.repo === "string"
        ? true
        : false;
    },
    {
      message:
        "Invalid repository format. Please use 'owner/repo' or a valid GitHub URL.",
    },
  )
  .transform((val) => {
    return val as { owner: string; repo: string };
  });

export const validateRepositoryInput = actionClient
  .schema(z.object({ input: RepositoryInputSchema, redirect: z.boolean() }))
  .metadata({
    actionName: "validateRepositoryInput",
  })
  .action(async ({ parsedInput, ctx }) => {
    const {
      input: { owner, repo },
      redirect: shouldRedirect,
    } = parsedInput;
    try {
      await gh.rest.repos.get({ owner, repo });
    } catch (error) {
      if (error instanceof Error) {
        throw new RepositoryError(error.message);
      }
      throw new RepositoryError("Error fetching GitHub repository");
    }

    const resourceId = (await cookies()).get("resourceId")?.value;

    if (!resourceId) throw new Error("Could not create thread");

    const agent = ctx.mastra.getAgent('agent');
    const memory = await agent.getMemory();

    if (!memory) throw new Error("Could not get memory");

    const resourceThreads = await memory.getThreadsByResourceId({
      resourceId,
    });

    const threads = resourceThreads?.filter(
      (thread) =>
        thread.metadata?.owner === owner && thread.metadata?.repo === repo,
    );

    if (!threads || threads.length === 0) {
      const thread = await memory.createThread({
        resourceId,
        metadata: { owner, repo },
      });

      if (thread) {
        if (shouldRedirect) redirect(`/${owner}/${repo}/${thread?.id}`);
      } else {
        throw new Error("Could not create thread");
      }
    } else {
      const thread = threads[0];
      if (shouldRedirect) {
        redirect(`/${owner}/${repo}/${thread?.id}`);
      }
    }
  });
