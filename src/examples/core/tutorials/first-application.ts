/**
 * Example: First application with two services
 * Used on: docs/core/tutorials/01-first-application.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { GreeterService } from "./greeter.service.mts";
import { NameService } from "./name.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  services: {
    greeter: GreeterService,
    names: NameService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
  "name.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function NameService({ logger }: TServiceParams) {
  const names = new Set<string>(["world"]);

  return {
    add: (name: string) => {
      names.add(name);
      logger.debug({ name }, "added name");
    },
    list: () => [...names],
  };
}
`,
  "greeter.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function GreeterService({ logger, lifecycle, my_app }: TServiceParams) {
  lifecycle.onReady(() => {
    // my_app.names is fully typed — TypeScript infers NameService's return type
    for (const name of my_app.names.list()) {
      logger.info(\`Hello, \${name}!\`);
    }
  });
}
`,
  "main.mts": `import { MY_APP } from "./application.mts";

// Add a name before bootstrap so it's in the set when onReady fires
MY_APP.bootstrap({
  configuration: { boilerplate: { LOG_LEVEL: "debug" } },
});
`,
}

export const defaultFile = "application.mts"
