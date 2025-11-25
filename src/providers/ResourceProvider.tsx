"use client";

import { memo, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import type { FC, PropsWithChildren } from "react";

import { createResourceId } from "@/actions/createResourceIdAction";

const ResourceProvider: FC<
  PropsWithChildren<{ resourceId: string | undefined }>
> = ({ children, resourceId }) => {
  const { execute, isPending } = useAction(createResourceId);

  useEffect(() => {
    if (!resourceId && !isPending) {
      console.log("executing");
      execute();
    }
  }, [execute, resourceId, isPending]);

  // Don't gate rendering - let pages handle resourceId checks
  // This ensures consistent hook calls across renders
  return <>{children}</>;
};

export const MemoizedResourceProvider = memo(
  ResourceProvider,
  (prev, next) => prev.resourceId === next.resourceId,
);
