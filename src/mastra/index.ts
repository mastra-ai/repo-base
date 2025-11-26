import { Mastra } from "@mastra/core/mastra";
import { agent } from "./agent";

// Extend the global type to include our mastra instance
declare global {
  var mastra: Mastra | undefined;
}

// Use a global variable to prevent duplicate instances during hot reloading in development
if (!global.mastra) {
  global.mastra = new Mastra({
    agents: { agent },
    telemetry: {
      enabled: false,
    },
  });
}

export const mastra = global.mastra;
