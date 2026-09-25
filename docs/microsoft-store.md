# Microsoft Store Release Plan

The current Electron build produces an AppX Store package. Microsoft Store can host,
sign, install, and update this package after submission.

## What You Need From Partner Center

After you create the app in Microsoft Partner Center and reserve the name, copy these values into `package.json`:

- `build.appx.identityName`
- `build.appx.publisher`
- `build.appx.publisherDisplayName`

The placeholders currently look like this:

```json
{
  "identityName": "ShaktiOS.FloatCalc",
  "publisher": "CN=0E4D184F-8AB0-4561-9A62-93A756DCBC5B"
}
```

Do not guess these. Use the exact Store identity values from Partner Center.

## Local Store Build

Before building for Store submission, remove the local Electron crash workaround in
`src/main.js` or migrate the wrapper to a Store-friendlier shell such as WebView2,
WinUI, or Tauri. The current GPU/sandbox command-line switches are acceptable only
as a local debugging workaround and should be treated as a certification risk.

Build a Store package:

```bash
npm install
npm run build:store:x64
```

Build x64 and arm64:

```bash
npm run build:store
```

The Store-oriented output is created under:

```text
release/
```

Look for an `.appx` file.

## Store Submission Flow

1. Open Partner Center.
2. Create or open the app product.
3. Reserve the app name.
4. Copy the Store identity values into `package.json`.
5. Build the AppX package.
6. Run local install/sideload testing.
7. Complete Store listing, screenshots, age rating, privacy policy, and certification notes.
8. Upload the `.appx` package.
9. Submit for certification.

## Important Notes

- For AppX submissions, Microsoft Store re-signs the package after certification.
- You do not need to buy a CA-trusted code-signing certificate for AppX Store submission.
- If you submit a traditional MSI/EXE instead, Microsoft does not re-sign it and you need your own Authenticode signing certificate.
- For Store releases, do not rely on `electron-updater`; Microsoft Store handles updates.
- Keep the app small, stable, and privacy-light for the first submission.
