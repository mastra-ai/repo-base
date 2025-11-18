import { Octokit } from "octokit";

export const gh = new Octokit({
    auth: process.env.GITHUB_TOKEN!,
});
