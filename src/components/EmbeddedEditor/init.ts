import { setupTypeAcquisition } from "@typescript/ata"
import type { Monaco } from "@monaco-editor/react"
import * as ts from "typescript"
import type * as MonacoEditor from "monaco-editor"

let initDone = false
let ataInstance: ((source: string) => void) | undefined

/**
 * One-time setup: Monaco compiler options + ATA with core types pre-fetched.
 * Safe to call from multiple editor instances — guarded by initDone.
 */
export function configureMonacoForEmbeddedEditor(
	monacoInstance: Monaco,
): void {
	if (initDone) return
	initDone = true

	monacoInstance.typescript.typescriptDefaults.setCompilerOptions({
		target: monacoInstance.typescript.ScriptTarget.ES2020,
		module: monacoInstance.typescript.ModuleKind.ESNext,
		moduleResolution: monacoInstance.typescript.ModuleResolutionKind.NodeJs,
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
		logger: {
			log: () => {},
			error: (...args: unknown[]) => console.error(...args),
			groupCollapsed: () => {},
			groupEnd: () => {},
		},
		delegate: {
			receivedFile: (code: string, path: string) => {
				monacoInstance.typescript.typescriptDefaults.addExtraLib(
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
 * Returns an array of disposables — call .dispose() on each when the editor
 * unmounts to remove the extra libs and prevent declare module augmentations
 * from one example contaminating the TypeScript context of another.
 *
 * @param monacoInstance - The Monaco instance from beforeMount
 * @param virtualRoot    - Unique base path, e.g. "file:///example-quickstart"
 * @param files          - Map of filename → source content
 */
export function registerExampleFiles(
	monacoInstance: Monaco,
	virtualRoot: string,
	files: Record<string, string>,
): MonacoEditor.IDisposable[] {
	const disposables: MonacoEditor.IDisposable[] = []

	for (const [name, content] of Object.entries(files)) {
		disposables.push(
			monacoInstance.typescript.typescriptDefaults.addExtraLib(
				content,
				`${virtualRoot}/${name}`,
			),
		)
	}

	// Trigger ATA for any packages imported by this example's files
	if (ataInstance) {
		for (const content of Object.values(files)) {
			ataInstance(content)
		}
	}

	return disposables
}
