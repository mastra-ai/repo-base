import { AppSidebar } from "@/components/custom/AppSidebar";
import { EnsureRepo } from "@/components/custom/EnsureRepo";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default async function RepoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ repo: string; owner: string }>;
}) {
  const { owner, repo } = await params;

  return (
    <SidebarProvider>
      <EnsureRepo>
        <AppSidebar owner={owner} repo={repo} />
        {children}
      </EnsureRepo>
    </SidebarProvider>
  );
}
