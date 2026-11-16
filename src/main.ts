import "./style.css";
import { MultiTapComposer } from "./keypad";

const MULTI_TAP_DELAY_MS = 900;
const composer = new MultiTapComposer();

function getElement<T extends HTMLElement>(
  id: string,
  elementType: { new(): T },
): T {
  const element = document.getElementById(id);
  if (!(element instanceof elementType)) {
    throw new Error(`The required page element "#${id}" was not found.`);
  }

  return element;
}

const typedText = getElement("typed-text", HTMLParagraphElement);
const pendingHint = getElement("pending-hint", HTMLParagraphElement);
const statusLabel = getElement("status-label", HTMLSpanElement);
const clearButton = getElement("clear-button", HTMLButtonElement);
const backspaceButton = getElement("backspace-button", HTMLButtonElement);
let commitTimer: number | null = null;

function cancelCommitTimer(): void {
  if (commitTimer !== null) {
    window.clearTimeout(commitTimer);
    commitTimer = null;
  }
}

function render(status: string): void {
  typedText.textContent = composer.text || "Start typing";
  typedText.classList.toggle("is-empty", composer.text.length === 0);
  pendingHint.textContent = composer.pendingLetter === null
    ? "TAP A KEY TO START"
    : `CURRENT LETTER: ${composer.pendingLetter} - TAP AGAIN TO CYCLE`;
  statusLabel.textContent = status;
}

function scheduleCommit(): void {
  cancelCommitTimer();
  commitTimer = window.setTimeout(() => {
    composer.commitPending();
    commitTimer = null;
    render("LETTER LOCKED");
  }, MULTI_TAP_DELAY_MS);
}

function pressKey(key: string): void {
  cancelCommitTimer();
  if (!composer.press(key)) {
    return;
  }

  if (composer.pendingLetter !== null) {
    scheduleCommit();
    render("TAP TO CYCLE");
    return;
  }

  render("SPACE ADDED");
}

document.querySelectorAll<HTMLButtonElement>("[data-key]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    if (key !== undefined) {
      pressKey(key);
    }
  });
});

clearButton.addEventListener("click", () => {
  cancelCommitTimer();
  composer.clear();
  render("CLEARED");
});

backspaceButton.addEventListener("click", () => {
  cancelCommitTimer();
  composer.backspace();
  render("DELETED");
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    event.preventDefault();
    pressKey(event.key);
  } else if (event.key === "Backspace") {
    event.preventDefault();
    cancelCommitTimer();
    composer.backspace();
    render("DELETED");
  }
});
