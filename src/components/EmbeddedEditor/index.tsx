import { Editor } from "@monaco-editor/react"
import React from "react"

import {
	configureMonacoForEmbeddedEditor,
	registerExampleFiles,
} from "./init"

const EDITOR_HEIGHT_PX = 400
const FILE_PICKER_WIDTH_PX = 160
const FILE_BUTTON_PADDING_TOP_BOTTOM_REM = 0.5
const FILE_BUTTON_PADDING_LEFT_RIGHT_REM = 0.75
const FILE_BUTTON_FONT_SIZE_REM = 0.875

// Monotonically incrementing counter for stable per-instance virtual roots
// when no exampleId is provided. useRef ensures stability across re-renders.
let instanceCounter = 0

export type EmbeddedEditorProps = {
	/** Source files to show in the editor. Keys are filenames, values are source. */
	files: Record<string, string>
	/** Which file to show first. Defaults to the first key in files. */
	defaultFile?: string
	/**
	 * Stable identifier for this editor instance. Used to build the virtual
	 * filesystem root so multiple editors on the same page don't collide.
	 * Recommended for any page with more than one editor.
	 */
	exampleId?: string
	/** Editor height in pixels. Defaults to 400. */
	height?: number
}

const EmbeddedEditor: React.FC<EmbeddedEditorProps> = ({
	files,
	defaultFile,
	exampleId,
	height = EDITOR_HEIGHT_PX,
}) => {
	const fileNames = Object.keys(files)
	const initialFile = defaultFile ?? fileNames[0] ?? ""
	const [selectedFile, setSelectedFile] = React.useState<string>(initialFile)

	// Stable virtual root per instance — computed once on mount
	const virtualRoot = React.useRef<string>(
		exampleId
			? `file:///example-${exampleId}`
			: `file:///example-${++instanceCounter}`,
	).current

	const handleBeforeMount = React.useCallback(
		(monaco: { languages: typeof import("monaco-editor").languages }) => {
			configureMonacoForEmbeddedEditor(monaco)
			registerExampleFiles(monaco, virtualRoot, files)
		},
		// virtualRoot is stable; files reference may change but content rarely does
		[virtualRoot, files],
	)

	if (fileNames.length === 0) return null

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				height: `${height}px`,
				border: "1px solid var(--ifm-color-emphasis-300)",
				borderRadius: "var(--ifm-global-radius)",
				overflow: "hidden",
			}}
		>
			<div style={{ flex: 1, minWidth: 0 }}>
				<Editor
					key={selectedFile}
					language="typescript"
					theme="vs-dark"
					path={`${virtualRoot}/${selectedFile}`}
					defaultValue={files[selectedFile]}
					beforeMount={handleBeforeMount}
					options={{
						automaticLayout: true,
						minimap: { enabled: false },
					}}
				/>
			</div>

			{fileNames.length > 1 && (
				<div
					style={{
						width: `${FILE_PICKER_WIDTH_PX}px`,
						borderLeft: "1px solid var(--ifm-color-emphasis-300)",
						backgroundColor: "var(--ifm-background-surface-color)",
						overflowY: "auto",
						flexShrink: 0,
					}}
				>
					{fileNames.map(name => (
						<button
							key={name}
							type="button"
							onClick={() => setSelectedFile(name)}
							style={{
								display: "block",
								width: "100%",
								padding: `${FILE_BUTTON_PADDING_TOP_BOTTOM_REM}rem ${FILE_BUTTON_PADDING_LEFT_RIGHT_REM}rem`,
								border: "none",
								borderBottom: "1px solid var(--ifm-color-emphasis-200)",
								background:
									selectedFile === name
										? "var(--ifm-color-emphasis-200)"
										: "transparent",
								cursor: "pointer",
								textAlign: "left",
								fontSize: `${FILE_BUTTON_FONT_SIZE_REM}rem`,
								fontFamily: "var(--ifm-font-family-monospace)",
								color: "var(--ifm-font-color-base)",
							}}
						>
							{name}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default EmbeddedEditor
