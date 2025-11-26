"use client";

import { type FC, useState } from "react";
import { GitBranch as Github, LoaderCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { validateRepositoryInput } from "@/actions/validateRepositoryInput";
import { cn } from "@/lib/utils";

export const InputForm: FC = () => {
  const [input, setInput] = useState("");
  const [, setErrorMessage] = useState<string | null>(null);

  const { execute, hasErrored, isPending } = useAction(
    validateRepositoryInput,
    {
      onError: ({ error }) => {
        if (error.serverError) {
          setErrorMessage(error.serverError);
        } else if (
          error.validationErrors?.input?._errors &&
          error.validationErrors.input._errors.length > 0
        ) {
          setErrorMessage(error.validationErrors.input._errors[0]);
        } else if (
          error.validationErrors?._errors &&
          error.validationErrors._errors.length > 0
        ) {
          setErrorMessage(error.validationErrors._errors[0]);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      },
      onSuccess: () => setErrorMessage(null),
    },
  );

  const handleSubmit = () => execute({ input, redirect: true });

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row w-full"
      action={handleSubmit}
    >
      <Input
        placeholder="facebook/react"
        className={cn("h-12 text-lg", hasErrored && "ring-1 ring-destructive")}
        type="text"
        name="input"
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button className="h-12 gap-2" size="lg" disabled={isPending}>
        {isPending ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : (
          <Github className="size-5" />
        )}
        Chat with repository
      </Button>
    </form>
  );
};
