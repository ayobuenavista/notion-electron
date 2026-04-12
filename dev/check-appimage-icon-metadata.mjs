import { mkdtempSync, readFileSync, rmSync, copyFileSync, chmodSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const appImagePath = path.resolve("dist/Notion_Electron-1.9.6-x86_64.AppImage");
const tempDir = mkdtempSync(path.join(os.tmpdir(), "notion-electron-appimage-"));
const tempAppImagePath = path.join(tempDir, "app.AppImage");

try {
	copyFileSync(appImagePath, tempAppImagePath);
	chmodSync(tempAppImagePath, 0o755);

	execFileSync(tempAppImagePath, ["--appimage-extract"], {
		cwd: tempDir,
		stdio: "ignore",
	});

	const desktopFilePath = path.join(
		tempDir,
		"squashfs-root",
		"notion-electron.desktop",
	);
	const desktopFileContents = readFileSync(desktopFilePath, "utf8");

	if (!desktopFileContents.includes("Icon=notion-electron")) {
		throw new Error(`AppImage desktop file is missing the expected icon name:\n${desktopFileContents}`);
	}

	if (!desktopFileContents.includes("StartupWMClass=notion-electron")) {
		throw new Error(
			`AppImage desktop file is missing the expected startup WM class:\n${desktopFileContents}`,
		);
	}

	console.log("AppImage icon metadata looks valid");
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
