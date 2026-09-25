# Microsoft Store Release via PWABuilder

FloatCalc is distributed to the Microsoft Store as a high-performance Progressive Web App (PWA) packaged using Microsoft's official **PWABuilder** engine.

This approach gives you:
- Zero heavy dependencies (no Electron crashes, no 400 MB runtime bloat).
- Native Windows Store integration (instant install, automatic updates, Store signing).
- Microsoft Store re-signing (no paid code-signing certificates needed).

---

## Store Identity Details (from Partner Center)

These values are registered under your Microsoft Partner Center account:

- **Package ID / Identity Name:** `ShaktiOS.FloatCalc`
- **Publisher ID:** `CN=0E4D184F-8AB0-4561-9A62-93A756DCBC5B`
- **Publisher Display Name:** `Shakti_OS`
- **App Name:** `FloatCalc`

---

## Packaging Steps

1. **Deploy to GitHub Pages:**
   - Host the `calculator-lock` repo via GitHub Pages to get an HTTPS URL (e.g. `https://agnicompute.github.io/floatcalc/src/`).

2. **Generate Store Package via PWABuilder:**
   - Go to [PWABuilder](https://www.pwabuilder.com).
   - Enter your live GitHub Pages URL.
   - Click **Package For Stores** -> **Windows**.
   - Input the Partner Center identity credentials listed above.
   - Download the generated `.msixbundle` or `.appxbundle`.

3. **Submit to Microsoft Partner Center:**
   - In Partner Center, go to your reserved product **FloatCalc**.
   - Upload the package file under **Packages**.
   - Fill out the basic store listing, descriptions, and screenshots.
   - Submit for certification.
