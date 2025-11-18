import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { mastra } from "@/mastra";

export async function POST(req: NextRequest) {
  const { owner, repo } = await req.json();

  const resourceId = (await cookies()).get("resourceId")!.value;
  const agent = mastra.getAgent("agent");
  const memory = await agent.getMemory();

  if (!memory) throw new Error("Mastra memory not set up");

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
      redirect(`/${owner}/${repo}/${thread?.id}`);
    }
  }
}
