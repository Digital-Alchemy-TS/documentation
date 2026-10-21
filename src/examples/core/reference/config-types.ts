/**
 * Example: legacy type-based configuration
 * Used on: docs/core/reference/config/types.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { AppService } from "./app.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    // Legacy string — plain string value
    API_URL: {
      type: "string",
      description: "Base URL for the upstream API",
      required: true,
    },

    // Legacy enum — narrows TypeScript, but does not runtime-validate
    ENVIRONMENT: {
      type: "string",
      enum: ["local", "staging", "production"] as const,
      default: "local",
    },

    // Legacy number — parsed with Number (invalid input may become NaN)
    PORT: {
      type: "number",
      default: 3000,
    },

    // Legacy boolean — only "true" and "y" strings become true
    DEBUG_MODE: {
      type: "boolean",
      default: false,
    },

    // Legacy string[] — CSV input remains supported
    ALLOWED_ORIGINS: {
      type: "string[]",
      default: ["http://localhost:3000"],
    },

    // Legacy record — string input is parsed as JSON
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
    const apiUrl: string = config.my_app.API_URL;
    const env: "local" | "staging" | "production" = config.my_app.ENVIRONMENT;
    const port: number = config.my_app.PORT;
    const debug: boolean = config.my_app.DEBUG_MODE;
    const origins: string[] = config.my_app.ALLOWED_ORIGINS;
    const flags: Record<string, string> = config.my_app.FEATURE_FLAGS;

    logger.info({ apiUrl, env, port, debug, origins, flags }, "legacy config loaded");
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
};

export const defaultFile = "application.mts";
