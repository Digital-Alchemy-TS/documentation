/**
 * Example: Testing basics with TestRunner
 * Used on: docs/core/tutorials/07-testing-basics.mdx
 */
export const files: Record<string, string> = {
  "counter.service.mts": `import type { TServiceParams } from "@digital-alchemy/core";

export function CounterService({ }: TServiceParams) {
  let count = 0;

  return {
    increment: () => { count++; },
    reset: () => { count = 0; },
    get value() { return count; },
  };
}
`,
  "application.mts": `import { CreateApplication } from "@digital-alchemy/core";
import { CounterService } from "./counter.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  services: {
    counter: CounterService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
`,
  "counter.test.mts": `import { TestRunner } from "@digital-alchemy/core";
import { MY_APP } from "./application.mts";

describe("CounterService", () => {
  let teardown: () => Promise<void>;

  afterEach(async () => {
    await teardown?.();
  });

  it("increments the count", async () => {
    await TestRunner(MY_APP)
      .run(async ({ my_app, teardown: td }) => {
        teardown = td;

        expect(my_app.counter.value).toBe(0);
        my_app.counter.increment();
        my_app.counter.increment();
        expect(my_app.counter.value).toBe(2);
      });
  });

  it("resets the count", async () => {
    await TestRunner(MY_APP)
      .run(async ({ my_app, teardown: td }) => {
        teardown = td;

        my_app.counter.increment();
        my_app.counter.reset();
        expect(my_app.counter.value).toBe(0);
      });
  });
});
`,
}

export const defaultFile = "counter.test.mts"
