/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { resolve } from "node:path";
import { defineConfig } from "vite";
import type { InlineConfig } from "vitest";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const VITEST_CONFIG: InlineConfig = {
	globals: true,
	environment: "jsdom",
	include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
};

// https://vitejs.dev/config/
export default defineConfig({
	test: VITEST_CONFIG,
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.spec.ts", "src/**/*.spec.tsx"],
		}),
		tsconfigPaths(),
		libInjectCss(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "AutoVizuA11y",
			formats: ["es", "umd"],
			fileName: (format) => {
				const OUTPUT: Partial<Record<typeof format, string>> = {
					es: "index.es.mjs",
					umd: "index.umd.cjs",
				};

				return OUTPUT[format] ?? "index.umd.cjs";
			},
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "react/jsx-runtime",
					"@feedzai/js-utilities": "JSUtilities",
				},
			},
		},
	},
});
