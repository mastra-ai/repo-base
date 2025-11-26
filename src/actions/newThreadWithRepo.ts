"use server";

import { z } from "zod";
import { actionClient } from ".";
import { redirect } from "next/navigation";

export const newThreadWithRepo = actionClient
  .metadata({ actionName: "newThreadWithRepo" })
  .schema(
    z.object({
      owner: z.string(),
      repo: z.string(),
      resourceId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { resourceId, owner, repo } = parsedInput;

    const agent = ctx.mastra.getAgent("agent");
    const memory = await agent.getMemory();

    if (!memory) throw new Error("Mastra memory not set up");

    const thread = await memory.createThread({
      resourceId,
      metadata: { owner, repo },
    });

    if (thread?.id) {
      redirect(`/${owner}/${repo}/${thread?.id}`);
    } else {
      throw new Error("Failed to create thread");
    }
  });
