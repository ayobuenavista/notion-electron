import path from "node:path";
import { packager } from "@electron/packager";

await packager({
	dir: ".",
	name: "notion-electron",
	platform: "linux",
	arch: "x64",
	out: "dist",
	icon: path.resolve("./notion-electron.png"),
	overwrite: true,
	asar: {
		unpackDir: path.join("node_modules", "@img"),
	},
});
