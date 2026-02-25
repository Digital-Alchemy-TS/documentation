/**
 * Example: Typed configuration
 * Used on: docs/core/tutorials/04-typed-configuration.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { ApiService } from "./api.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    API_URL: {
      type: "string",
      description: "Base URL for the upstream API",
      required: true,
    },
    PORT: {
      type: "number",
      description: "HTTP port to listen on",
      default: 3000,
    },
    DEBUG: {
      type: "boolean",
      default: false,
    },
    ALLOWED_ORIGINS: {
      type: "string[]",
      default: ["http://localhost:3000"],
    },
    ENVIRONMENT: {
      type: "string",
      enum: ["local", "staging", "production"] as const,
      default: "local",
    },
  },
  services: {
    api: ApiService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
  "api.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function ApiService({ logger, lifecycle, config }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    // Hover over config.my_app to see the fully typed config object
    // config.my_app.PORT         → number
    // config.my_app.DEBUG        → boolean
    // config.my_app.ENVIRONMENT  → "local" | "staging" | "production"
    logger.info({
      port: config.my_app.PORT,
      env: config.my_app.ENVIRONMENT,
      debug: config.my_app.DEBUG,
    }, "config loaded");
  });

  lifecycle.onBootstrap(async () => {
    // API_URL is required — bootstrap would have failed if it wasn't set
    logger.info({ url: config.my_app.API_URL }, "connecting to upstream");
  });
}
`,
  "main.mts": `import { MY_APP } from "./application.mts";

await MY_APP.bootstrap({
  configuration: {
    my_app: {
      API_URL: "https://api.example.com",
      PORT: 8080,
      ENVIRONMENT: "staging",
    },
  },
});
`,
}

export const defaultFile = "application.mts"
