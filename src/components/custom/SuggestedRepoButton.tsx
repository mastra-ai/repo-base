"use client";

import type { ReactNode } from "react";
import { useAction } from "next-safe-action/hooks";
import { GitBranch as Github, LoaderCircle } from "lucide-react";

import { Card, CardHeader, CardTitle } from "../ui/card";
import { listThreadsOrCreateNewThread } from "@/actions/listThreadsOrCreateNewThread";

export function SuggestedRepoButton({
  owner,
  repo,
  children,
}: {
  owner: string;
  repo: string;
  children: ReactNode;
}) {
  const { execute, isPending } = useAction(listThreadsOrCreateNewThread);

  return (
    <Card
      onClick={() => execute({ owner: owner, repo: repo })}
      className="flex flex-col h-[140px] transition-all hover:border-primary hover:shadow-md cursor-pointer rounded-md"
    >
      <CardHeader className="grow">
        <CardTitle className="flex items-center gap-2 text-base truncate">
          {isPending ? (
            <LoaderCircle className="animate-spin shrink-0 size-4" />
          ) : (
            <Github className="size-4 shrink-0" />
          )}
          <span className="truncate">
            {owner}/{repo}
          </span>
        </CardTitle>
        {children}
      </CardHeader>
    </Card>
  );
}
