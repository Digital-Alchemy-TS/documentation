/**
 * Example: declaration-emit — function vs arrow services
 * Used on: blog/function-vs-arrow-declaration-emit.mdx
 *
 * Both files type-check identically *inside this single program*. That is the
 * whole trap: the difference does not exist at the source level — it only shows
 * up in the `.d.ts` TypeScript emits, which is what a downstream package reads.
 */
export const files: Record<string, string> = {
	"lighting.mts": `import { CreateLibrary, type TServiceParams } from "@digital-alchemy/core";

// ✅ A named *function declaration*. In the emitted .d.ts this stays a
//    referenceable symbol, so a library that captures LIGHTING in its
//    \`implies\` emits \`typeof import("./lighting.mjs").Lights\` — a real
//    module edge that carries the augmentation below to downstream consumers.
export function Lights({ logger }: TServiceParams) {
  let brightness = 0;
  return {
    dim(toPercent: number) {
      brightness = toPercent;
      logger.info(\`lights → \${toPercent}%\`);
    },
    get brightness() {
      return brightness;
    },
  };
}

export const LIGHTING = CreateLibrary({
  name: "lighting",
  services: { Lights },
});

declare module "@digital-alchemy/core" {
  interface LoadedModules {
    lighting: typeof LIGHTING;
  }
}
`,
	"lighting-arrow.mts": `import { CreateLibrary, type TServiceParams } from "@digital-alchemy/core";

// ❌ The exact same logic as an arrow assigned to a const. Hover \`Lights\` in
//    both files — the inferred type is identical *here*. But this form emits
//    \`export declare const Lights: (p: TServiceParams) => {...}\` (a structural
//    type, no symbol to point at), so a downstream \`implies\` inlines it with
//    NO import edge. The augmentation never travels: the service still wires,
//    but \`params.lighting\` is untyped across a package boundary.
export const Lights = ({ logger }: TServiceParams) => {
  let brightness = 0;
  return {
    dim(toPercent: number) {
      brightness = toPercent;
      logger.info(\`lights → \${toPercent}%\`);
    },
    get brightness() {
      return brightness;
    },
  };
};

export const LIGHTING = CreateLibrary({
  name: "lighting",
  services: { Lights },
});

declare module "@digital-alchemy/core" {
  interface LoadedModules {
    lighting: typeof LIGHTING;
  }
}
`,
}

export const defaultFile = "lighting.mts"
