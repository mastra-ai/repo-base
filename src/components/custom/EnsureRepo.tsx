"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState, type FC, type PropsWithChildren } from "react";

import { Button } from "../ui/button";
import { validateRepositoryInput } from "@/actions/validateRepositoryInput";

export const EnsureRepo: FC<PropsWithChildren> = ({ children }) => {
  const { owner, repo } = useParams();
  const [validated, setValidated] = useState(false);

  const { execute, hasErrored } = useAction(validateRepositoryInput, {
    onSettled: () => setValidated(true),
  });

  useEffect(() => {
    if (!validated) {
      execute({ input: `${owner}/${repo}`, redirect: false });
    }
  }, [execute, owner, repo, validated]);

  return (
    <>
      {/* Always render children to maintain consistent hook calls */}
      <div style={{ display: validated && !hasErrored ? 'contents' : 'none' }}>
        {children}
      </div>
      
      {/* Error state overlay */}
      {hasErrored && (
        <div className="h-dvh flex flex-col items-center justify-center">
          <h1 className="font-semibold text-lg">Error retrieving repository</h1>
          <Button variant="link">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      )}
      
      {/* Loading state overlay */}
      {!validated && !hasErrored && (
        <div className="h-dvh flex items-center justify-center">
          <div className="text-muted-foreground">Loading repository...</div>
        </div>
      )}
    </>
  );
};
