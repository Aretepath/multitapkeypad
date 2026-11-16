# Keytap

Keytap is a small TypeScript browser app for practicing the multi-tap texting
used on classic mobile phones. Click the number buttons or use the number keys
on your keyboard.

## Run it

Install dependencies once:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To stop
the server, press `Ctrl+C` in the terminal.

## Check your work

Run the unit tests:

```sh
npm test
```

Check TypeScript types:

```sh
npm run typecheck
```

Create a production build (this also checks the types):

```sh
npm run build
```

To try the production build locally after building:

```sh
npm run preview
```

## How multi-tap works

- Tap a key once to show its first letter; tap it again quickly to cycle to
  the next letter.
- Wait briefly, or press a different key, to commit the current letter.
- Key `0` commits the current letter and inserts a space.
- Delete removes an in-progress letter first, then removes committed text.
- Key `1` cycles punctuation (`. , ? !`). Keys `2`-`9` use the classic
  letter mapping.

For **HOME**, tap `4` twice for H, `6` three times for O, pause, tap `6` once
for M, then `3` twice for E. The pauses distinguish two letters typed with the
same key.

## Project map

```text
index.html           The page structure and the keypad buttons
src/
  keypad.ts          Letter mapping and multi-tap message state
  main.ts            Connects the keypad, timer, and message display
  style.css          Phone layout, colors, and responsive styles
tests/
  keypad.test.ts     Tests for letter selection and editing behavior
```

## Following the code

Start with `KEY_LETTERS` and `MultiTapComposer` in `src/keypad.ts`. The
composer keeps committed characters separate from the letter currently being
chosen. `src/main.ts` starts a short timer after each letter key press; when
that timer expires, it asks the composer to commit the pending letter. The
unit tests exercise the composer without needing to open a browser.
