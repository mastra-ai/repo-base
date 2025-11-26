import { CardDescription } from "../ui/card";
import { SuggestedRepoButton } from "./SuggestedRepoButton";

// Static descriptions for suggested repos - no need to fetch from GitHub API on every page load
const REPO_DESCRIPTIONS: Record<string, string> = {
  "mastra-ai/mastra": "A TypeScript framework for building AI applications and workflows",
  "assistant-ui/assistant-ui": "React Components for AI Chat",
  "vercel/next.js": "The React Framework for Production",
  "facebook/react": "The library for web and native user interfaces",
  "tailwindlabs/tailwindcss": "A utility-first CSS framework for rapid UI development",
  "shadcn/ui": "Beautifully designed components that you can copy and paste into your apps",
};

export async function SuggestedRepo({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const repoKey = `${owner}/${repo}`;
  const description = REPO_DESCRIPTIONS[repoKey] || null;

  return (
    <SuggestedRepoButton owner={owner} repo={repo}>
      <CardDescription className="line-clamp-2">{description}</CardDescription>
    </SuggestedRepoButton>
  );
}
