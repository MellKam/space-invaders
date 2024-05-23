import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import svg from "vite-plugin-solid-svg";

export default defineConfig({
	plugins: [
		solid(),
		svg({ svgo: { enabled: false }, defaultAsComponent: false }),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
