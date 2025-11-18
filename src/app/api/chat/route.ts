import type { NextRequest } from "next/server";

import { toAISdkFormat } from "@mastra/ai-sdk";
import { mastra } from "@/mastra";
import { createUIMessageStreamResponse } from 'ai';
import { MessageInput } from "@mastra/core/agent/message-list";
import { ThreadUserMessage } from "@assistant-ui/react";


export async function POST(req: NextRequest) {
  const agent = mastra.getAgent("agent");
  const memory = await agent.getMemory();

  if (!memory) throw new Error("Mastra memory not set up");

  const resourceId = req.cookies.get("resourceId")!.value;


  const { messages, owner, repo, threadId } = await req.json();


  /**
   * Since we're manually creating threads, this ensures we generate a title from the first user message
   */
  if (messages.length === 1) {
    const thread = await memory.getThreadById({ threadId });

    if (!thread?.title || thread?.title === "New Thread") {
      const agent = mastra.getAgent("agent");
      const title = await agent.generateTitleFromUserMessage(
        { message: messages.filter((m: ThreadUserMessage) => m.role === "user")[0] as MessageInput, tracingContext: {} },
      );

      await memory.saveThread({
        thread: {
          id: threadId,
          title,
          resourceId,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: { owner, repo, nextThread: false },
        }
      });
    }
  }

  try {
    const res = await agent.stream(messages, {
      context: [
        {
          role: "system",
          content: `The repository owner is ${owner} and the repository name is ${repo}`,
        },
      ],
      resourceId,
      threadId,
      toolChoice: "auto",
      maxSteps: 10,
    });

    return createUIMessageStreamResponse({
      stream: toAISdkFormat(res, { from: "agent" }),
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}
