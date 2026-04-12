import test from "node:test";
import assert from "node:assert/strict";
import { selectDisplayMediaSource } from "../lib/linuxSystemAudio.mjs";

test("selectDisplayMediaSource returns the only available source", () => {
	const source = { id: "screen:0:0", name: "Built-in Display" };

	assert.equal(selectDisplayMediaSource([source]), source);
});

test("selectDisplayMediaSource rejects empty source lists", () => {
	assert.equal(selectDisplayMediaSource([]), null);
});

test("selectDisplayMediaSource rejects multiple display sources", () => {
	assert.equal(
		selectDisplayMediaSource([
			{ id: "screen:0:0", name: "Built-in Display" },
			{ id: "screen:1:0", name: "External Display" },
		]),
		null,
	);
});
