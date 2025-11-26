import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

// Extend the global type to include our pgStore
declare global {
  var pgStore: PostgresStore | undefined;
  var memory: Memory | undefined;
}

// Function to get or create the PostgresStore instance
function getPgStore(): PostgresStore {
  if (!global.pgStore) {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    global.pgStore = new PostgresStore({
      connectionString: process.env.DB_URL!,
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    });
  }
  return global.pgStore;
}

// Function to get or create the memory instance so we can make a dockerfile at build time
export function getMemory(): Memory {
  if (!global.memory) {
    global.memory = new Memory({
      storage: getPgStore(),
      options: { lastMessages: 10 },
    });
  }
  return global.memory;
}
