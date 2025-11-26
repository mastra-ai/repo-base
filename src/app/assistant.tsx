"use client";

import { type FC } from "react";
import { useParams } from "next/navigation";
import type { AiMessageType } from "@mastra/core";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

import { Thread } from "@/components/assistant-ui/thread";
import ToolUIWrapper from "@/components/assistant-ui/tool-ui";
import { DefaultChatTransport } from "ai";

interface AssistantProps {
  initialMessages: Array<
    AiMessageType & { role: Exclude<AiMessageType["role"], "data"> }
  >;
}

export const Assistant: FC<AssistantProps> = ({ initialMessages }) => {
  const { owner, repo, threadId } = useParams();

  const runtime = useChatRuntime({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { owner, repo, threadId },
    }),
    messages: initialMessages as any || [],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-dvh w-full">
        <Thread />
        <ToolUIWrapper />
      </div>
    </AssistantRuntimeProvider>
  );
};
