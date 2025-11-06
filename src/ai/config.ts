import { configureGenkit } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

// Configure Genkit with Google AI provider
// Note: In production, you would set up API keys via environment variables
export function configureAI() {
  configureGenkit({
    plugins: [googleAI()],
    logLevel: "info",
    enableTracingAndMetrics: true,
  });
}

// Initialize AI configuration
if (typeof window === "undefined") {
  // Only configure on server side
  configureAI();
}

