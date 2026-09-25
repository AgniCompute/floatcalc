# FloatCalc

A clean, lightweight Windows desktop calculator with a **Pin** toggle to stay above your windows and a full **Calculation History** drawer.

Built as an ultra-lean Progressive Web App (PWA) ready for local desktop use and Microsoft Store packaging. Zero bloated runtime dependencies.

---

## Features

- **Always on top**: Pin the calculator so it never disappears behind your browser or spreadsheet.
- **Calculation History**: Automatic equation and result recording with click-to-recall.
- **Lightweight & Fast**: Pure standard web technologies; starts instantly with near-zero memory footprint.
- **Offline Capable**: Backed by a service worker cache.
- **Dual Themes**: Crisp light and high-contrast dark modes with instant toggle.
- **Full Keyboard Support**: Numpad, `Enter` / `=`, `Escape`, backspace, and operator shortcuts.

---

## Architecture

- `src/index.html`: Clean, accessible interface.
- `src/styles.css`: Modern responsive UI with theme variable tokens.
- `src/renderer.js`: Precision mathematical calculation, keyboard handling, and persistent history.
- `src/sw.js`: Service worker for reliable offline execution.
- `src/manifest.json`: Web app manifest configured for standalone desktop presentation.

---

## Local Development & Testing

Open `src/index.html` in Microsoft Edge, Chrome, or your default browser.

To verify JavaScript syntax:
```bash
node scripts/check-syntax.js
```

---

## License

MIT © [Radhe Patel](https://github.com/AgniCompute)
