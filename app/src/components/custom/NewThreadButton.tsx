"use client";

import type { FC } from "react";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { newThreadWithRepo } from "@/actions/newThreadWithRepo";
import { SidebarGroupAction } from "../ui/sidebar";

interface NewThreadWithRepoButtonProps {
  owner: string;
  repo: string;
  resourceId: string;
}

export const NewThreadWithRepoButton: FC<NewThreadWithRepoButtonProps> = ({
  owner,
  repo,
  resourceId,
}) => {
  const { execute, isPending } = useAction(newThreadWithRepo);
  return (
    <SidebarGroupAction
      title="New chat with repo"
      disabled={isPending}
      onClick={() => execute({ owner, repo, resourceId })}
    >
      <Plus />
    </SidebarGroupAction>
  );
};
