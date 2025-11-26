import Link from "next/link";
import type { FC } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";

import { gh } from "@/lib/octokit";
import { Button } from "../ui/button";
import type { StorageThreadType } from "@mastra/core";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface RepoThreadProps {
  thread: StorageThreadType;
}

export const RepoThread: FC<RepoThreadProps> = async ({ thread }) => {
  const repo = await gh.rest.repos.get({
    owner: thread.metadata?.owner as string,
    repo: thread.metadata?.repo as string,
  });

  return (
    <li key={thread.id} className="flex items-center space-x-4 p-4 bg-gray-50">
      <Avatar>
        <AvatarImage
          src={repo.data.owner.avatar_url}
          alt={repo.data.full_name}
        />
        <AvatarFallback>
          {repo.data.full_name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        {thread.title && <h3 className="font-semibold">{thread.title}</h3>}
        <p className="text-sm text-gray-500">{repo.data.full_name}</p>
        <p className="text-xs text-gray-400">
          {new Date(thread.updatedAt).toLocaleString()}
        </p>
      </div>
      <Link
        href={`/${thread.metadata?.owner}/${thread.metadata?.repo}/${thread.id}`}
        passHref
      >
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Continue chat
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </li>
  );
};
