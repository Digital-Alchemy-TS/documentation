/**
 * Example: schema-backed typed configuration
 * Used on: docs/core/tutorials/04-typed-configuration.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { Type } from "typebox";
import { CreateApplication } from "@digital-alchemy/core";
import { ApiService } from "./api.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    API_URL: {
      schema: Type.String({
        description: "Base URL for the upstream API",
      }),
    },
    PORT: {
      schema: Type.Integer({
        default: 3000,
        description: "HTTP port to listen on",
      }),
    },
    DEBUG: {
      schema: Type.Boolean({ default: false }),
    },
    ALLOWED_ORIGINS: {
      schema: Type.Array(Type.String(), {
        default: ["http://localhost:3000"],
      }),
    },
    ENVIRONMENT: {
      schema: Type.Union([
        Type.Literal("local"),
        Type.Literal("staging"),
        Type.Literal("production"),
      ], { default: "local" }),
    },
    LABEL: {
      schema: Type.Optional(Type.String({ description: "Optional status label" })),
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
    // Hover over config.my_app to see the provider output types.
    const port: number = config.my_app.PORT;
    const env: "local" | "staging" | "production" = config.my_app.ENVIRONMENT;
    const debug: boolean = config.my_app.DEBUG;
    const origins: string[] = config.my_app.ALLOWED_ORIGINS;
    const label: string | undefined = config.my_app.LABEL;

    logger.info({ port, env, debug, origins, label }, "config loaded");
  });

  lifecycle.onBootstrap(() => {
    // API_URL is a bare TypeBox string, so a missing value fails before this hook.
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
      LABEL: "demo",
    },
  },
});
`,
};

export const defaultFile = "application.mts";
