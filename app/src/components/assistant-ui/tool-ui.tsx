"use client";

import { z } from "zod";
import type { FC, ReactNode } from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import {
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  OctagonX,
  Star,
  TriangleAlert,
} from "lucide-react";

import { Card, CardContent } from "../ui/card";
import {
  GetRepositoryStarsArgs,
  GetRepositoryStarsResults,
} from "@/mastra/tools/getRepositoryStars";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

type ToolStatus = "running" | "complete" | "incomplete" | "requires-action";

const statusIconMap: Record<ToolStatus, ReactNode> = {
  running: <LoaderCircle className="animate-spin text-indigo-500 size-4" />,
  complete: <CheckCircle className="text-emerald-500 size-4" />,
  "requires-action": <TriangleAlert className="text-amber-500 size-4" />,
  incomplete: <OctagonX className="text-rose-500 size-4" />,
};

type GetFileContentArgs = z.infer<typeof GetFileContentArgsSchema>;
type GetFileContentResult = z.infer<typeof GetFileContentResultSchema>;
type GetFilePathsArgs = z.infer<typeof GetFilePathsArgsSchema>;
type GetFilePathsResult = string[];
type GetRepositoryIssuesArgs = z.infer<typeof GetRepositoryIssuesArgsSchema>;
type GetRepositoryIssuesResult = z.infer<
  typeof GetRepositoryIssuesResultSchema
>;
type GetRepositoryCommitsArgs = z.infer<typeof GetRepositoryCommitsArgsSchema>;
type GetRepositoryCommitsResult = z.infer<
  typeof GetRepositoryCommitsResultSchema
>;
type GetRepositoryPullRequestsArgs = z.infer<
  typeof GetRepositoryPullRequestsArgsSchema
>;
type GetRepositoryPullRequestsResult = z.infer<
  typeof GetRepositoryPullRequestsResultSchema
>;

type ToolArgs =
  | {
    toolName: "getFileContent";
    displayName: "Get file content";
    args: GetFileContentArgs;
  }
  | {
    toolName: "getFilePaths";
    displayName: "Get files";
    args: GetFilePathsArgs;
  }
  | {
    toolName: "getRepositoryIssues";
    displayName: "Get issues";
    args: GetRepositoryIssuesArgs;
  }
  | {
    toolName: "getRepositoryCommits";
    displayName: "Get commits";
    args: GetRepositoryCommitsArgs;
  }
  | {
    toolName: "getRepositoryPullRequests";
    displayName: "Get pull requests";
    args: GetRepositoryPullRequestsArgs;
  };

type ToolContainerProps = {
  status: ToolStatus;
} & ToolArgs;

const ToolContainer: FC<ToolContainerProps> = ({
  displayName,
  toolName,
  status,
  args,
}) => {
  const renderArgs = () => {
    if (!args) {
      return <p>No arguments to display.</p>;
    }

    switch (toolName) {
      case "getFileContent":
        return <p>{args.path}</p>;
      case "getRepositoryIssues":
        return <p>{args.state}</p>;
      case "getRepositoryPullRequests":
        return <p>{args.state}</p>;
      case "getRepositoryCommits":
      case "getFilePaths":
      default:
        return null;
    }
  };

  return (
    <Card className="mb-1.5 rounded-lg">
      <CardContent className="inline-flex items-center gap-2 p-3 text-sm">
        <span>{statusIconMap[status]}</span>
        <span className="font-semibold">{displayName}</span>
        <span className="text-muted-foreground">{renderArgs()}</span>
      </CardContent>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetFilePathsArgsSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
  tree_sha: z
    .string()
    .describe("SHA or branch to start listing commits from")
    .default("main"),
});

export const GetFilePathsToolUI = makeAssistantToolUI<
  GetFilePathsArgs,
  GetFilePathsResult
>({
  toolName: "getFilePaths",
  render: ({ args, status, toolName }) => {
    return (
      <ToolContainer
        displayName="Get files"
        toolName={toolName as "getFilePaths"}
        status={status.type}
        args={args}
      />
    );
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetFileContentArgsSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  path: z.string().describe("The file path to fetch content for"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetFileContentResultSchema = z.union([
  z
    .object({
      ok: z.literal(true),
      content: z.string().describe("The decoded content of the file"),
    })
    .describe("The success object"),
  z
    .object({
      ok: z.literal(false),
      messsage: z
        .string()
        .describe("An optional error message of what went wrong"),
    })
    .describe("The error/failed object"),
]);

export const GetFileContentToolUI = makeAssistantToolUI<
  GetFileContentArgs,
  GetFileContentResult
>({
  toolName: "getFileContent",
  render: ({ args, status, toolName }) => {
    return (
      <ToolContainer
        displayName="Get file content"
        toolName={toolName as "getFileContent"}
        status={status.type}
        args={args}
      />
    );
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryIssuesArgsSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
  state: z
    .enum(["open", "closed", "all"])
    .default("all")
    .describe("The state of the issue"),
  labels: z
    .array(z.string())
    .optional()
    .describe("List of label names to filter issues by"),
  assignee: z
    .string()
    .optional()
    .describe("GitHub username of the assignee to filter issues by"),
  creator: z
    .string()
    .optional()
    .describe("GitHub username of the issue creator to filter by"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch"),
  perPage: z
    .number()
    .int()
    .max(100)
    .default(30)
    .describe("The number of results per page (max 100)"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryIssuesResultSchema = z.union([
  z.array(
    z.object({
      body: z.string().nullable().describe("The body content of the issue"),
      number: z.number().int().describe("The issue number"),
      state: z.enum(["open", "closed"]).describe("The state of the issue"),
      title: z.string().describe("The title of the issue"),
      url: z.string().url().describe("The url to the issue"),
      labels: z
        .array(
          z.object({
            name: z.string().describe("The name of the label"),
            color: z.string().describe("The color of the label"),
          }),
        )
        .describe("The labels attached to the issue"),
      assignees: z
        .array(
          z.object({
            avatarUrl: z
              .string()
              .url()
              .nullable()
              .describe("The url of the assignee's avatar"),
            url: z
              .string()
              .url()
              .nullable()
              .describe("The url to the assignee's profile"),
            username: z
              .string()
              .nullable()
              .describe("The github username of the assignee"),
          }),
        )
        .describe("The users assigned to the issue"),
      user: z
        .object({
          avatarUrl: z
            .string()
            .url()
            .nullable()
            .describe("The url of the user's avatar"),
          url: z
            .string()
            .url()
            .nullable()
            .describe("The url to the user's profile"),
          username: z.string().nullable().describe("The github username"),
        })
        .describe("The user details of the issue creator"),
      createdAt: z.string().describe("The creation date of the issue"),
      updatedAt: z.string().describe("The last update date of the issue"),
      closedAt: z
        .string()
        .nullable()
        .describe("The closing date of the issue if closed"),
    }),
  ),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export const GetRepositoryIssuesToolUI = makeAssistantToolUI<
  GetRepositoryIssuesArgs,
  GetRepositoryIssuesResult
>({
  toolName: "getRepositoryIssues",
  render: ({ args, status, toolName }) => {
    return (
      <ToolContainer
        displayName="Get issues"
        toolName={toolName as "getRepositoryIssues"}
        status={status.type}
        args={args}
      />
    );
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryCommitsArgsSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryCommitsResultSchema = z.union([
  z
    .object({
      ok: z.literal(true),
      commits: z
        .array(
          z.object({
            sha: z.string().describe("The SHA hash of the commit"),
            message: z.string().describe("The commit message"),
            date: z
              .string()
              .datetime()
              .nullish()
              .describe("The date of the commit"),
            url: z.string().url().describe("The URL to view the commit"),
            author: z
              .object({
                name: z.string().describe("The name of the author"),
                email: z.string().describe("The email of the author"),
                username: z
                  .string()
                  .optional()
                  .describe("The GitHub username of the author"),
                avatarUrl: z
                  .string()
                  .url()
                  .optional()
                  .describe("The URL of the author's avatar"),
                url: z
                  .string()
                  .url()
                  .optional()
                  .describe("The URL of the author's profile"),
              })
              .describe("The commit author information"),
            verified: z
              .boolean()
              .describe("Whether the commit signature is verified"),
          }),
        )
        .describe("List of commits"),
    })
    .describe("The success object"),
  z
    .object({
      ok: z.literal(false),
      message: z.string(),
    })
    .describe("The error/failed object"),
]);

export const GetRepositoryCommitsToolUI = makeAssistantToolUI<
  GetRepositoryCommitsArgs,
  GetRepositoryCommitsResult
>({
  toolName: "getRepositoryCommits",
  render: ({ args, status, toolName }) => {
    return (
      <ToolContainer
        displayName="Get commits"
        toolName={toolName as "getRepositoryCommits"}
        status={status.type}
        args={args}
      />
    );
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryPullRequestsArgsSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
  state: z
    .enum(["open", "closed", "all"])
    .default("all")
    .describe("The state of the pull request"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch."),
  perPage: z
    .number()
    .int()
    .max(100)
    .default(30)
    .describe("The number of results per page (max 100)."),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetRepositoryPullRequestsResultSchema = z.union([
  z.array(
    z.object({
      body: z.string().nullable().describe("The body content of the pr"),
      number: z.number().int().describe("The pull request number"),
      state: z
        .enum(["open", "closed"])
        .describe("The state of the pull request"),
      title: z.string().describe("The title of the pull request"),
      url: z.string().url().describe("The url to the pull request"),
      user: z
        .object({
          avatarUrl: z
            .string()
            .url()
            .nullable()
            .describe("The url of the user"),
          url: z.string().url().nullable().describe("The url to the user"),
          username: z.string().nullable().describe("The github user name"),
        })
        .describe("The user details"),
    }),
  ),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export const GetRepositoryPullRequestsToolUI = makeAssistantToolUI<
  GetRepositoryPullRequestsArgs,
  GetRepositoryPullRequestsResult
>({
  toolName: "getRepositoryPullRequests",
  render: ({ args, status, toolName }) => {
    return (
      <ToolContainer
        displayName="Get pull requests"
        toolName={toolName as "getRepositoryPullRequests"}
        status={status.type}
        args={args}
      />
    );
  },
});

const GetRepositoryStarsToolUI = makeAssistantToolUI<
  GetRepositoryStarsArgs,
  GetRepositoryStarsResults
>({
  toolName: "getRepositoryStars",
  render: ({ args, status, result }) => {
    const renderContent = () => {
      switch (status.type) {
        case "running":
          return <Skeleton className="w-full h-20" />;
        case "complete":
          if (result && typeof result === "object" && "ok" in result && result.ok) {
            return (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Star className="size-8 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-3xl font-bold">{result.starCount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(result.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          return <p>No data available</p>;
        case "incomplete":
        case "requires-action":
          return (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {status.reason === "error"
                  ? `An error occurred: ${status.error}`
                  : `Operation incomplete: ${status.reason}`}
              </AlertDescription>
            </Alert>
          );
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Star Count for {args.owner}/{args.repo}
        </h2>
        {renderContent()}
      </div>
    );
  },
});

const ToolUIWrapper: FC = () => {
  return (
    <>
      <GetFilePathsToolUI />
      <GetFileContentToolUI />
      <GetRepositoryStarsToolUI />
      <GetRepositoryIssuesToolUI />
      <GetRepositoryCommitsToolUI />
      <GetRepositoryPullRequestsToolUI />
    </>
  );
};

export const ToolsByNameComponents = {
  getFilePaths: GetFilePathsToolUI,
  getFileContent: GetFileContentToolUI,
  getRepositoryIssues: GetRepositoryIssuesToolUI,
  getRepositoryCommits: GetRepositoryCommitsToolUI,
  getRepositoryPullRequests: GetRepositoryPullRequestsToolUI,
};

export default ToolUIWrapper;
