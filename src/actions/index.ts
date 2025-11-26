import { mastra } from "@/mastra";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { RepositoryError } from "./errors";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    if (e instanceof RepositoryError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () => z.object({ actionName: z.string() }),
}).use(({ next }) => next({ ctx: { mastra } }));
