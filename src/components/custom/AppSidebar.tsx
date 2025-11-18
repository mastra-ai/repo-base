import { cookies } from "next/headers";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";
import { mastra } from "@/mastra";
import Link from "next/link";
import { CustomSidebarMenuItem } from "./CustomSidebarMenuItem";
import { Home } from "lucide-react";
import { NewThreadWithRepoButton } from "./NewThreadButton";

export const AppSidebar = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const resourceId = (await cookies()).get("resourceId")?.value;

  const agent = mastra.getAgent("agent");
  const memory = await agent.getMemory();

  if (!memory) throw new Error("Mastra memory not set up");

  if (resourceId) {
    const grouped = Object.groupBy(
      (
        (await memory.getThreadsByResourceId({
          resourceId,
        })) ?? []
      ).sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate()),
      ({ metadata }) =>
        metadata?.owner === owner && metadata?.repo === repo ? "repo" : "other",
    );

    return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home /> Repo Base
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <NewThreadWithRepoButton
              owner={owner}
              repo={repo}
              resourceId={resourceId}
            />
            <SidebarGroupLabel>
              Chats with {owner}/{repo}
            </SidebarGroupLabel>
            <SidebarMenu>
              {grouped["repo"]?.map((t) => (
                <CustomSidebarMenuItem key={t.id} t={t} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Other chats</SidebarGroupLabel>
            <SidebarMenu>
              {grouped["other"]?.map((t) => (
                <SidebarMenuItem key={t.id} className="truncate">
                  <SidebarMenuButton className="h-min gap-0.5" asChild>
                    <Link
                      href={`/${t.metadata?.owner}/${t.metadata?.repo}/${t.id}`}
                      className="flex-col items-start"
                    >
                      <p className="w-full truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground w-full truncate">
                        {`${t.metadata?.owner as string}/${t.metadata?.repo as string}`}
                      </p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="h-12"></div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuSkeleton />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
