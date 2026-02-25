import { setupTypeAcquisition } from "@typescript/ata"
import * as ts from "typescript"
import type * as Monaco from "monaco-editor"

let initDone = false
let ataInstance: ((source: string) => void) | undefined

/**
 * One-time setup: Monaco compiler options + ATA with core types pre-fetched.
 * Safe to call from multiple editor instances — guarded by initDone.
 */
export function configureMonacoForEmbeddedEditor(
	monacoInstance: typeof Monaco,
): void {
	if (initDone) return
	initDone = true

	monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
		target: monacoInstance.languages.typescript.ScriptTarget.ES2022,
		module: monacoInstance.languages.typescript.ModuleKind.ESNext,
		moduleResolution:
			monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
		allowImportingTsExtensions: true,
		allowNonTsExtensions: true,
		allowSyntheticDefaultImports: true,
		esModuleInterop: true,
		skipLibCheck: true,
		moduleDetection: 3,
	})

	ataInstance = setupTypeAcquisition({
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
		fetcher: async url => fetch(url),
	})

	// Pre-fetch core types so IntelliSense is ready on first load
	ataInstance(
		`import { CreateApplication, type TServiceParams } from "@digital-alchemy/core"`,
	)
}

/**
 * Register an example's virtual files in Monaco and trigger ATA for any
 * packages they import. Each editor instance gets its own virtualRoot so
 * multiple editors on the same page don't share a virtual filesystem.
 *
 * @param monacoInstance - The Monaco instance from beforeMount
 * @param virtualRoot    - Unique base path, e.g. "file:///example-quickstart"
 * @param files          - Map of filename → source content
 */
export function registerExampleFiles(
	monacoInstance: typeof Monaco,
	virtualRoot: string,
	files: Record<string, string>,
): void {
	for (const [name, content] of Object.entries(files)) {
		monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
			content,
			`${virtualRoot}/${name}`,
		)
	}

	// Trigger ATA for any packages imported by this example's files
	if (ataInstance) {
		for (const content of Object.values(files)) {
			ataInstance(content)
		}
	}
}
