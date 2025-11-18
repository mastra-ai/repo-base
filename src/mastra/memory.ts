import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

// Extend the global type to include our pgStore
declare global {
  var pgStore: PostgresStore | undefined;
}

// Use a global variable to prevent duplicate connections during hot reloading in development
if (!global.pgStore) {
  global.pgStore = new PostgresStore({ connectionString: process.env.DB_URL! });
}

const pgStore = global.pgStore;

export const memory = new Memory({ storage: pgStore, options: { lastMessages: 10 } });
