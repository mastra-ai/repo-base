import { gh } from "@/lib/octokit";
import { CardDescription } from "../ui/card";
import { SuggestedRepoButton } from "./SuggestedRepoButton";

export async function SuggestedRepo({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  let description: string | null = null;

  try {
    console.log(owner, repo);
    const repoRes = await gh.rest.repos.get({ owner, repo });
    console.log(repoRes);
    description = repoRes.data.description;
  } catch (error) {
    console.error(error);
  }

  return (
    <SuggestedRepoButton owner={owner} repo={repo}>
      <CardDescription className="line-clamp-2">{description}</CardDescription>
    </SuggestedRepoButton>
  );
}
