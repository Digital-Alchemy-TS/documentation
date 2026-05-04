/**
 * Example: TServiceParams full reference
 * Used on: docs/core/reference/services/service-params.mdx
 */
export const files: Record<string, string> = {
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { ExplorerService } from "./explorer.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    API_URL: { type: "string", default: "https://api.example.com" },
  },
  services: {
    explorer: ExplorerService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
  "explorer.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function ExplorerService({
  // --- Core params ---
  logger,       // GetLogger — scoped to "my_app:explorer"
  lifecycle,    // TLifecycleBase — register stage callbacks
  config,       // TInjectedConfig — typed config per module
  scheduler,    // TScheduler — cron, interval, timeout
  event,        // EventEmitter — app-wide event bus
  als,          // AlsExtension — async local storage
  context,      // TContext — "my_app:explorer" (string brand)
  internal,     // InternalDefinition — utils, boot info
  params,       // TServiceParams — reference to self

  // --- Module services (available after LoadedModules declaration) ---
  my_app,       // your own app's other services
}: TServiceParams) {

  // logger: scoped, pre-bound to context
  logger.info("wiring explorer");
  logger.debug({ context }, "context string");

  // config: typed, available after onPostConfig
  lifecycle.onPostConfig(() => {
    const url: string = config.my_app.API_URL;
    logger.info({ url }, "config ready");
  });

  // scheduler: returns RemoveCallback; auto-stopped at PreShutdown
  const stopTimer = scheduler.setTimeout(() => {
    logger.info("5 seconds elapsed");
  }, "5s");

  // event: Node.js EventEmitter, shared across all services
  event.on("my-event", (data: unknown) => {
    logger.info({ data }, "received event");
  });

  // als: async local storage
  lifecycle.onBootstrap(() => {
    als.run({ logs: {} }, () => {
      logger.info("inside ALS context");
    });
  });

  // internal.utils: utility methods
  const title = internal.utils.titleCase("my_service_name"); // "My Service Name"
  const ms = internal.utils.getIntervalMs("5m"); // 300000

  // internal.boot: introspect the running application
  lifecycle.onReady(() => {
    const modules = [...internal.boot.loadedModules.keys()];
    logger.info({ modules }, "loaded modules");
  });

  // internal.removeFn: create a dual-callable RemoveCallback
  const cleanup = internal.removeFn(() => {
    logger.info("cleanup called");
  });
  // cleanup() and cleanup.remove() both work

  // internal.safeExec: run a callback, catch and log any errors
  lifecycle.onBootstrap(async () => {
    await internal.safeExec({
      context,
      exec: async () => {
        // errors here are logged, not thrown
      },
    });
  });

  // params: self-reference (useful for passing the full params object deeper)
  // params === the entire TServiceParams object

  lifecycle.onShutdownStart(() => {
    stopTimer(); // or stopTimer.remove()
    logger.info("shutting down");
  });
}
`,
}

export const defaultFile = "explorer.service.mts"
