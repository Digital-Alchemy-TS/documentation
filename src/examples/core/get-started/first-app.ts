/**
 * Example: First Digital Alchemy application
 * Used on: docs/core/get-started/quickstart.mdx
 */
export const files: Record<string, string> = {
	"application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { HelloService } from "./hello.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  services: {
    hello: HelloService,
  },
});

// Extend the LoadedModules interface so TypeScript knows
// what's available on TServiceParams
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
	"hello.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function HelloService({ logger, lifecycle }: TServiceParams) {
  lifecycle.onReady(() => {
    logger.info("Hello, Digital Alchemy!");
  });
}
`,
	"main.mts": `import { MY_APP } from "./application.mts";

await MY_APP.bootstrap();
`,
}

export const defaultFile = "application.mts"
