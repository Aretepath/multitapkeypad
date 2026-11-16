import assert from "node:assert/strict";
import test from "node:test";
import { KEY_LETTERS, MultiTapComposer } from "../src/keypad.ts";

test("uses the classic phone letter assignments", () => {
  assert.equal(KEY_LETTERS["2"], "ABC");
  assert.equal(KEY_LETTERS["7"], "PQRS");
  assert.equal(KEY_LETTERS["9"], "WXYZ");
  assert.equal(KEY_LETTERS["1"], ".,?!");
});

test("repeated presses cycle through a key and wrap around", () => {
  const composer = new MultiTapComposer();

  composer.press("4");
  assert.equal(composer.text, "G");
  composer.press("4");
  assert.equal(composer.text, "H");
  composer.press("4");
  assert.equal(composer.text, "I");
  composer.press("4");
  assert.equal(composer.text, "G");
});

test("a different key commits the pending letter", () => {
  const composer = new MultiTapComposer();

  composer.press("4");
  composer.press("6");

  assert.equal(composer.text, "GM");
  assert.equal(composer.pendingLetter, "M");
});

test("committing a letter lets the same key start a new letter", () => {
  const composer = new MultiTapComposer();

  composer.press("6");
  composer.press("6");
  composer.press("6");
  composer.commitPending();
  composer.press("6");

  assert.equal(composer.text, "OM");
  assert.equal(composer.pendingLetter, "M");
});

test("zero commits the current letter and adds a space", () => {
  const composer = new MultiTapComposer();

  composer.press("4");
  composer.press("0");

  assert.equal(composer.text, "G ");
  assert.equal(composer.pendingLetter, null);
});

test("backspace removes the pending letter before committed text", () => {
  const composer = new MultiTapComposer();

  composer.press("4");
  composer.press("6");
  composer.backspace();
  assert.equal(composer.text, "G");

  composer.backspace();
  assert.equal(composer.text, "");
});

test("clear removes pending and committed characters", () => {
  const composer = new MultiTapComposer();

  composer.press("4");
  composer.press("6");
  composer.clear();

  assert.equal(composer.text, "");
  assert.equal(composer.pendingLetter, null);
});
