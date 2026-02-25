/**
 * Example: All configuration types
 * Used on: docs/core/reference/config/types.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { AppService } from "./app.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    // string — plain string value
    API_URL: {
      type: "string",
      description: "Base URL for the upstream API",
      required: true,
    },

    // string with enum — TypeScript narrows to a union literal type
    ENVIRONMENT: {
      type: "string",
      enum: ["local", "staging", "production"] as const,
      default: "local",
    },

    // number — parsed from string in env ("3000" → 3000)
    PORT: {
      type: "number",
      default: 3000,
    },

    // boolean — "true"/"1"/"y" → true; "false"/"0"/"n" → false
    DEBUG_MODE: {
      type: "boolean",
      default: false,
    },

    // string[] — comma-separated in env: "a,b,c" → ["a","b","c"]
    ALLOWED_ORIGINS: {
      type: "string[]",
      default: ["http://localhost:3000"],
    },

    // record — arbitrary key/value pairs; JSON string in env
    FEATURE_FLAGS: {
      type: "record",
      default: {},
    },
  },
  services: {
    app: AppService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
  "app.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function AppService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    // Hover over each config value to see its TypeScript type

    const apiUrl: string = config.my_app.API_URL;

    // enum narrows to "local" | "staging" | "production"
    const env: "local" | "staging" | "production" = config.my_app.ENVIRONMENT;

    const port: number = config.my_app.PORT;

    const debug: boolean = config.my_app.DEBUG_MODE;

    const origins: string[] = config.my_app.ALLOWED_ORIGINS;

    const flags: Record<string, unknown> = config.my_app.FEATURE_FLAGS;

    logger.info({ apiUrl, env, port, debug, origins, flags }, "config loaded");
  });
}
`,
  "main.mts": `import { MY_APP } from "./application.mts";

await MY_APP.bootstrap({
  configuration: {
    my_app: {
      API_URL: "https://api.example.com",
      ENVIRONMENT: "staging",
      DEBUG_MODE: true,
      ALLOWED_ORIGINS: ["https://app.example.com"],
    },
  },
});
`,
}

export const defaultFile = "application.mts"
