import { accessSync, readdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIST_ROOT = path.resolve("dist/notion-electron-linux-x64/resources/app.asar.unpacked");
const SHARP_NODE_PATH = path.join(
	DIST_ROOT,
	"node_modules/@img/sharp-linux-x64/lib/sharp-linux-x64.node",
);
const LIBVIPS_DIR = path.join(
	DIST_ROOT,
	"node_modules/@img/sharp-libvips-linux-x64/lib",
);

function assertExists(filePath, label) {
	try {
		accessSync(filePath);
	} catch {
		throw new Error(`Missing ${label}: ${filePath}`);
	}
}

function findLibvipsFile(dirPath) {
	const entries = readdirSync(dirPath);
	return entries.find((entry) => entry.startsWith("libvips-cpp.so.")) ?? null;
}

assertExists(DIST_ROOT, "packaged app.asar.unpacked directory");
assertExists(SHARP_NODE_PATH, "packaged sharp native module");
assertExists(LIBVIPS_DIR, "packaged sharp libvips directory");

const libvipsFile = findLibvipsFile(LIBVIPS_DIR);

if (!libvipsFile) {
	throw new Error(`No packaged libvips shared library found in ${LIBVIPS_DIR}`);
}

const lddOutput = execFileSync("ldd", [SHARP_NODE_PATH], {
	encoding: "utf8",
});

if (lddOutput.includes("not found")) {
	throw new Error(`Unresolved native dependency for packaged sharp:\n${lddOutput}`);
}

console.log(`sharp packaging looks valid: found ${libvipsFile}`);
