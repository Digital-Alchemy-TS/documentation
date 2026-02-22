import { setupTypeAcquisition } from "@typescript/ata"
import * as ts from "typescript"
import type * as Monaco from "monaco-editor"

const EXAMPLE_ROOT = "file:///example"

const EXAMPLE_FILES: Record<string, string> = {
	"main.mts": `import { CreateApplication } from "@digital-alchemy/core"
import { MyFirstService } from "./my.service.mts"

export const MY_APPLICATION = CreateApplication({
  name: "example_app",
  services: {
    my_service: MyFirstService,
  },
})

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    example_app: typeof MY_APPLICATION
  }
}
`,
	"my.service.mts": `import type { TServiceParams } from "@digital-alchemy/core"

export function MyFirstService({ logger, example_app }: TServiceParams) {
  logger.info("hello world")
}
`,
}

let initDone = false

export function configureMonacoForEmbeddedEditor(monacoInstance: typeof Monaco): void {
	if (initDone) return
	initDone = true

	monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
		target: monacoInstance.languages.typescript.ScriptTarget.ES2022,
		module: monacoInstance.languages.typescript.ModuleKind.ESNext,
		moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
		allowImportingTsExtensions: true,
		allowNonTsExtensions: true,
		allowSyntheticDefaultImports: true,
		esModuleInterop: true,
		skipLibCheck: true,
		moduleDetection: 3,
	})

	// Register all example files as extra libs so imports resolve
	for (const [name, content] of Object.entries(EXAMPLE_FILES)) {
		monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
			content,
			`${EXAMPLE_ROOT}/${name}`,
		)
	}

	const ata = setupTypeAcquisition({
		projectName: "EmbeddedEditor",
		typescript: ts,
		logger: { log: () => {} },
		delegate: {
			receivedFile: (code: string, path: string) => {
				monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
					code,
					path.startsWith("file://") ? path : `file://${path}`,
				)
			},
		},
		fetcher: async (url) => fetch(url),
	})

	ata(`import { CreateApplication, type TServiceParams } from "@digital-alchemy/core"`)
}

export { EXAMPLE_FILES, EXAMPLE_ROOT }
