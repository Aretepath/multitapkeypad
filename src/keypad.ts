// The classic phone layout assigns letters to keys 2 through 9. Key 1 is punctuation.
export const KEY_LETTERS: Readonly<Record<string, string>> = {
  "1": ".,?!",
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
};

export class MultiTapComposer {
  private readonly committedCharacters: string[] = [];
  private activeKey: string | null = null;
  private activeLetterIndex = 0;

  // The pending letter is shown immediately but only added to the message on commit.
  get pendingLetter(): string | null {
    if (this.activeKey === null) {
      return null;
    }

    return KEY_LETTERS[this.activeKey][this.activeLetterIndex];
  }

  get text(): string {
    return this.committedCharacters.join("") + (this.pendingLetter ?? "");
  }

  press(key: string): boolean {
    if (key === "0") {
      this.commitPending();
      this.committedCharacters.push(" ");
      return true;
    }

    const letters = KEY_LETTERS[key];
    if (letters === undefined) {
      return false;
    }

    if (this.activeKey === key) {
      // A quick repeat cycles through the letters on the same physical key.
      this.activeLetterIndex = (this.activeLetterIndex + 1) % letters.length;
      return true;
    }

    this.commitPending();
    this.activeKey = key;
    this.activeLetterIndex = 0;
    return true;
  }

  commitPending(): void {
    const letter = this.pendingLetter;
    if (letter === null) {
      return;
    }

    this.committedCharacters.push(letter);
    this.activeKey = null;
    this.activeLetterIndex = 0;
  }

  backspace(): void {
    if (this.activeKey !== null) {
      // Delete the in-progress letter first; a second delete removes committed text.
      this.activeKey = null;
      this.activeLetterIndex = 0;
      return;
    }

    this.committedCharacters.pop();
  }

  clear(): void {
    this.committedCharacters.length = 0;
    this.activeKey = null;
    this.activeLetterIndex = 0;
  }
}
