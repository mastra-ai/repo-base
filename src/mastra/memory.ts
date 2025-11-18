import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

let pgStore: PostgresStore | undefined = undefined;

if (!pgStore) {
  pgStore = new PostgresStore({ connectionString: process.env.DB_URL! });
}

export const memory = new Memory({ storage: pgStore, options: { lastMessages: 10 } });
