import type { Plugin } from "@docusaurus/types"

/**
 * Webpack resolve fallbacks for packages that require Node builtins (e.g. typescript via @typescript/ata).
 */
const webpackFallbackPlugin: Plugin = function () {
	return {
		name: "webpack-fallback",
		configureWebpack() {
			return {
				resolve: {
					fallback: {
						module: false,
					},
				},
			}
		},
	}
}

export default webpackFallbackPlugin
