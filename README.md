# FloatCalc

A modern, precision-engineered Windows desktop calculator featuring a frameless translucent UI, native **Always-On-Top** pinning, **Shunting Yard Parentheses & Precedence Engine**, **Live Equation Sequel Preview**, **Collapsible Scientific Tray**, **Ghost Mode Opacity**, and persistent **Calculation History**.

<div align="center">
  <br>
  <video src="https://github.com/AgniCompute/floatcalc/raw/main/docs/demo.mp4" controls autoplay loop muted playsinline width="640" style="max-width: 100%; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
    <p>Your browser does not support the video tag. Watch the demo here: <a href="docs/demo.mp4"><code>docs/demo.mp4</code></a></p>
  </video>
  <p><em>Demonstrating Always-On-Top window pinning (<code>Ctrl+P</code>), parentheses precedence, scientific drawer, and ghost mode opacity.</em></p>
  <br>
</div>

---

## Key Features

- **Always-On-Top Window Locking (`Ctrl+P`)**: Float your calculator above spreadsheets, web browsers, and IDEs without losing focus.
- **Scientific Drawer & Parentheses (`Alt+S`)**:
  - Full mathematical order of operations with balanced parentheses `(` and `)`.
  - Trigonometric functions: $\sin, \cos, \tan$ with immediate `DEG` / `RAD` mode toggle.
  - Powers and roots: $\sqrt{x}, x^2, x^y$ (power operator `^`).
  - Logarithms & constants: $\ln, \log_{10}, 1/x, \pi$.
- **Live Sequence Preview**: Active equations display in real time as you enter operands (e.g. `(2 + 3) * 4` before pressing enter) and resolve seamlessly to `(2 + 3) * 4 = 20`.
- **Ghost Mode / Transparency**: Adjust window opacity down to 30% from the Settings menu to see underlying documents while calculating.
- **One-Click Result Copy**: Click directly on the display number to copy the value to your clipboard with an animated confirmation badge.
- **Persistent Calculation Tape (`Alt+H`)**: Session history saved locally with instant entry recall and clear controls.
- **Frameless Acrylic Aesthetic**: Sleek glassmorphic card design with subtle 1px border highlight and smooth 12px rounded corners.

---

## Download & Installation

### Option 1: Standalone Portable App (Recommended for Users)
1. Download **`FloatCalc-v1.0.0-Windows.zip`** from [GitHub Releases](https://github.com/AgniCompute/floatcalc/releases).
2. Extract the archive to any folder on your PC.
3. Double-click **`floatcalc.exe`** to launch immediately. No installer or administrator permissions needed!

### Option 2: Run From Source (Developers)
```bash
# 1. Clone the repository
git clone https://github.com/AgniCompute/floatcalc.git
cd floatcalc

# 2. Install dependencies
npm install

# 3. Launch developer instance
npm start
```

---

## Verification & Automated Test Suite

FloatCalc includes an automated developer verification suite testing math precision, parentheses precedence, edge cases, and state flow:

```bash
# Run unit and equation precedence tests
npm test

# Run JavaScript syntax validation
npm run check
```

---

## Project Structure

```text
floatcalc/
├── src/
│   ├── index.html        # Semantic, accessible UI layout
│   ├── styles.css        # Frameless Acrylic theme & design tokens
│   ├── renderer.js       # Shunting-yard engine, scientific math & history
│   ├── main.js           # Electron window lifecycle, opacity & pin IPC
│   ├── preload.js        # Secure context-isolated bridge
│   ├── icon-192.svg      # App icon asset (192px)
│   └── icon-512.svg      # App icon asset (512px)
├── scripts/
│   ├── test-functional.js # Developer-grade automated verification suite
│   └── check-syntax.js    # Syntax validation runner
├── docs/
│   └── design-direction.md # Architectural invariants & color hierarchy
├── .gitignore            # Clean git exclusion rules
├── package.json          # Dependencies & scripts
└── README.md             # Project documentation
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `0` - `9` | Input digits |
| `+`, `-`, `*`, `/` | Arithmetic operators (`+`, `−`, `×`, `÷`) |
| `^` | Power operator ($x^y$) |
| `(` and `)` | Parentheses grouping |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Clear calculator / Close active overlay |
| `Ctrl + P` | Toggle Always-on-Top (Pin mode) |
| `Alt + S` | Toggle Scientific drawer |
| `Alt + H` | Toggle Calculation History drawer |

---

## License

MIT © [Radhe Patel](https://github.com/AgniCompute)
