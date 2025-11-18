import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { mastra } from "@/mastra";
import { Assistant } from "@/app/assistant";

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string; threadId: string }>;
}) {
  const resourceId = (await cookies()).get("resourceId")?.value;
  const { threadId } = await params;

  const agent = mastra.getAgent('agent');
  const memory = await agent.getMemory();

  if (!memory) notFound();

  const [queryResponse, thread] = await Promise.all([
    memory.query({ threadId }),
    memory.getThreadById({ threadId }),
  ]);

  if (!thread || !resourceId) notFound();

  const initialMessages = (queryResponse?.uiMessages ?? []).map((m) => ({
    ...m,
    content:
      m.content === "" && !!m.toolInvocations?.length
        ? m.toolInvocations?.map((tool) => ({ ...tool, type: "tool-call" }))
        : m.content,
  }));

  return (
    <Assistant
      //@ts-expect-error type mismatch
      initialMessages={initialMessages}
    />
  );
}
