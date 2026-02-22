import { Editor } from "@monaco-editor/react"
import React from "react"

import { configureMonacoForEmbeddedEditor, EXAMPLE_FILES, EXAMPLE_ROOT } from "./init"

const EDITOR_HEIGHT_PX = 400
const FILE_PICKER_WIDTH_PX = 140
const FILE_BUTTON_PADDING_TOP_BOTTOM_REM = 0.5
const FILE_BUTTON_PADDING_LEFT_RIGHT_REM = 0.75
const FILE_BUTTON_FONT_SIZE_REM = 0.875

const EmbeddedEditor: React.FC = () => {
	const [selectedFile, setSelectedFile] = React.useState<string>("main.mts")
	const fileNames = Object.keys(EXAMPLE_FILES)

	const handleBeforeMount = React.useCallback((monaco: { languages: typeof import("monaco-editor").languages }) => {
		configureMonacoForEmbeddedEditor(monaco)
	}, [])

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				height: `${EDITOR_HEIGHT_PX}px`,
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
					path={`${EXAMPLE_ROOT}/${selectedFile}`}
					defaultValue={EXAMPLE_FILES[selectedFile]}
					beforeMount={handleBeforeMount}
					options={{
						automaticLayout: true,
						minimap: { enabled: false },
					}}
				/>
			</div>
			<div
				style={{
					width: `${FILE_PICKER_WIDTH_PX}px`,
					borderLeft: "1px solid var(--ifm-color-emphasis-300)",
					backgroundColor: "var(--ifm-background-surface-color)",
					overflowY: "auto",
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
							background:
								selectedFile === name
									? "var(--ifm-color-emphasis-200)"
									: "transparent",
							cursor: "pointer",
							textAlign: "left",
							fontSize: `${FILE_BUTTON_FONT_SIZE_REM}rem`,
							fontFamily: "var(--ifm-font-family-monospace)",
						}}
					>
						{name}
					</button>
				))}
			</div>
		</div>
	)
}

export default EmbeddedEditor
