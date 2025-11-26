import { InputForm } from "@/components/custom/inputForm";
import { SuggestedRepo } from "@/components/custom/SuggestedRepo";

export const dynamic = "force-dynamic"; // Help with container build because github repos are not being called at build time

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 w-full">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Repo Chat
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-secondary-foreground">
              Chat with any GitHub repository. Understand code faster.
            </p>

            <p className="text-sm text-muted-foreground">
              Made with ❤️ love from{" "}
              <a className="underline" href="https://mastra.ai/">
                mastra.ai
              </a>{" "}
              and{" "}
              <a className="underline" href="https://assistant-ui.com">
                assistant-ui
              </a>
            </p>
          </div>
        </div>

        <div className="bg-background p-6">
          <div className="flex flex-col items-center gap-6">
            <InputForm />
            <p className="text-sm text-muted-foreground px-1 text-center w-full max-w-[60ch]">
              Accepts full GitHub repository URL or the shorthand.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Popular Repositories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SuggestedRepo owner="mastra-ai" repo="mastra" />
            <SuggestedRepo owner="assistant-ui" repo="assistant-ui" />
            <SuggestedRepo owner="vercel" repo="next.js" />
            <SuggestedRepo owner="facebook" repo="react" />
            <SuggestedRepo owner="tailwindlabs" repo="tailwindcss" />
            <SuggestedRepo owner="shadcn" repo="ui" />
          </div>
        </div>
      </div>
    </main>
  );
}
