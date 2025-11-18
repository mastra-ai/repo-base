import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { mastra } from "@/mastra";

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {

  const agent = mastra.getAgent('agent');
  const memory = await agent.getMemory();

  if (!memory) notFound();

  const [resourceId, { owner, repo }] = await Promise.all([
    (await cookies()).get("resourceId")?.value,
    await params,
  ]);

  if (!resourceId) return <div>No cookie</div>; // should not happen

  const resourceThreads = await memory.getThreadsByResourceId({
    resourceId,
  });

  const repoThreads =
    resourceThreads?.filter(
      (thread) =>
        thread.metadata?.owner === owner && thread.metadata?.repo === repo,
    ) ?? [];

  const nextThread = repoThreads.find((t) => !!t.metadata?.nextThread);

  let threadId: string;

  if (!nextThread) {
    const thread = await memory.createThread({
      resourceId,
      metadata: { owner, repo, nextThread: true },
    });

    if (thread) {
      threadId = thread.id;
    } else {
      notFound();
    }
  } else {
    threadId = nextThread.id;
  }

  redirect(`/${owner}/${repo}/${threadId}`);
}
