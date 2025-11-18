"use server";

import { z } from "zod";
import { actionClient } from ".";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const listThreadsOrCreateNewThread = actionClient
  .metadata({ actionName: "listThreadsOrCreateNewThread" })
  .schema(
    z.object({
      owner: z.string(),
      repo: z.string(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { owner, repo } = parsedInput;
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

      try {
        const thread = await memory.createThread({
          resourceId,
          metadata: { owner, repo },
        });
        redirect(`/${owner}/${repo}/${thread?.id}`);
      } catch (error) {
        console.error(error);
        throw new Error("Could not create thread");
      }

    } else {
      redirect(`/${owner}/${repo}`);
    }
  });
