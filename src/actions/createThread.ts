"use server";

import { z } from "zod";
import { actionClient } from ".";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const createThread = actionClient
  .metadata({ actionName: "createThread" })
  .schema(z.object({ owner: z.string(), repo: z.string() }))
  .action(async ({ ctx, parsedInput: { owner, repo } }) => {
    const resourceId = (await cookies()).get("resourceId")?.value;

    if (!resourceId) throw new Error("Could not create thread");

    const agent = ctx.mastra.getAgent('agent');
    const memory = await agent.getMemory();

    if (!memory) throw new Error("Could not get memory");

    const thread = await memory.createThread({
      resourceId,
      metadata: { owner, repo },
    });

    if (!thread) throw new Error("Could not create thread");

    redirect(`/${owner}/${repo}/${thread.id}`);
  });
