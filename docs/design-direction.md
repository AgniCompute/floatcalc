# FloatCalc Design Direction

FloatCalc should feel like a compact Windows utility: familiar, fast, and calm enough to leave floating above other work.

## Design Principles

- **Familiar layout first.** Keep the standard calculator grid predictable: utilities on top, operators on the right, equals as the strongest action.
- **Dark gray, not black.** Dark mode uses layered gray surfaces for depth and readability instead of pure black or high-saturation gradients.
- **One accent system.** Operators use a cool blue surface; equals uses a warm amber accent. Avoid adding more dominant colors unless a new function truly needs it.
- **Readable numerals.** Use Segoe UI with tabular numerals so values feel native on Windows and do not jump visually.
- **Small-window discipline.** Settings should behave like a popover, close quickly, and never compete with the calculator.

## Research Notes

- Microsoft Fluent guidance favors tokenized color choices that adapt between light and dark themes.
- Fluent button guidance emphasizes accessible contrast in every interaction state.
- Material dark theme guidance favors smoky dark grays, desaturated color, and contrast without eye strain.
- Calculator references commonly preserve the right-side operator column and use one strong equals action color.

## Current Direction

The current UI is Standard-only until additional modes have real layouts. Scientific and Compact should not return until they change the keypad and behavior.
