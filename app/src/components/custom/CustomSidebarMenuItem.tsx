"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { StorageThreadType } from "@mastra/core";

export const CustomSidebarMenuItem = ({ t }: { t: StorageThreadType }) => {
  const { owner, repo, threadId } = useParams();

  return (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuButton
        className="truncate"
        asChild
        isActive={threadId === t.id}
      >
        <Link href={`/${owner}/${repo}/${t.id}`}>
          <span>{t.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
