# FloatCalc

A clean, modern Windows desktop calculator featuring a seamless frameless design, native **Always-On-Top** window locking, **Live Equation Sequel Preview**, and persistent **Calculation History**.

---

## Highlights

- 📌 **Always-On-Top Pinning**: Lock the calculator window on top so it never gets buried behind spreadsheets, browsers, or code editors.
- ⚡ **Live Equation Sequel Preview**: View active equations updating live in real time as you type operands (e.g. `2 + 2` shows before hitting enter) and completes into `2 + 2 =` with the result.
- ⏱ **Calculation History Drawer**: Complete session history stored locally with one-click recall and history clearing.
- 🎨 **Seamless Frameless UI**: Sleek, borderless layout with subtle 1px border, smooth 12px corners, and instant Light/Dark theme switching.
- ⌨ **Full Keyboard Navigation**: Full numpad support, `Enter` / `=`, `Escape`, backspace, and operator keys.
- 🧪 **Developer-Grade Test Suite**: Automated unit and DOM test suite verifying math precision, edge cases, and state flow.

---

## How to Run & Download

### Option 1: Standalone Desktop Download (No Setup Needed)
If you want to use FloatCalc directly without programming tools:
1. Download the latest **`FloatCalc-Windows.zip`** from the [GitHub Releases](https://github.com/AgniCompute/floatcalc/releases) section.
2. Extract the folder to any location on your PC.
3. Double-click **`floatcalc.exe`** to run. No installation or administrator permissions required!

### Option 2: Run from Source (Developers)
If you have Node.js installed:

```bash
# 1. Clone the repository
git clone https://github.com/AgniCompute/floatcalc.git
cd floatcalc

# 2. Install dependencies
npm install

# 3. Launch the desktop app
npm start
```

---

## Automated Verification & Tests

FloatCalc includes an automated functional test suite that verifies DOM readiness, math operations, live sequence previews, and history persistence:

```bash
# Run the test suite
npm test

# Run syntax integrity checks
npm run check
```

---

## Project Structure

```
calculator-lock/
├── src/
│   ├── index.html        # Clean, accessible UI markup
│   ├── styles.css        # Frameless styling and design tokens
│   ├── renderer.js      # Calculation engine, live preview & history
│   ├── main.js           # Electron desktop window lifecycle & IPC
│   ├── preload.js        # Secure context isolation bridge
│   ├── manifest.json     # Web application manifest
│   └── sw.js             # Service worker cache
├── scripts/
│   ├── test-functional.js # Automated verification test suite
│   └── check-syntax.js   # Syntax validation script
├── docs/                 # Architecture and design guides
└── package.json          # Project configuration & scripts
```

---

## License

MIT © [Radhe Patel](https://github.com/AgniCompute)

