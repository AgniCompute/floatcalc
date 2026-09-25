# Distribution Guide

This app can be distributed the same way many indie Windows desktop apps are distributed.

## Best Direct Download Path

Use GitHub Releases.

Users download:

- Windows installer: `FloatCalc-0.1.0-x64.exe`
- Optional portable app: `FloatCalc-Portable-0.1.0-x64.exe`

Developers clone the repo and run:

```bash
npm install
npm run dev
```

## Release From Your Computer

```bash
npm install
npm run lint
npm run build
npm run build:portable
```

Upload the generated files from `release/` and `release-portable/` to GitHub Releases.

## Release Automatically With GitHub Actions

1. Replace `YOUR_GITHUB_USERNAME` in `package.json`.
2. Push the repo to GitHub.
3. Create a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will build the Windows installer and upload it to a release.

## Auto Updates

For Microsoft Store releases, the Store should handle updates.

For direct GitHub releases, add an updater only if you are intentionally maintaining a non-Store distribution channel.

Do not mix GitHub auto-updates into the Microsoft Store build path.

## Code Signing

Unsigned Windows apps may trigger Microsoft Defender SmartScreen warnings.

Real options:

- Start unsigned for early testers.
- Use Microsoft Trusted Signing or another Authenticode certificate for direct EXE/MSI distribution.
- Publish MSIX through Microsoft Store if you want Microsoft-managed signing, hosting, updates, and discovery.

Code signing becomes more important once strangers are downloading the app.

## Winget

After you have stable GitHub Releases, you can submit the app to the Windows Package Manager community repository.

That lets users install it with:

```powershell
winget install FloatCalc
```

## Good Public Repo Checklist

- Add a real app icon.
- Replace placeholder GitHub repo values in `package.json`.
- Add screenshots or a short GIF to the README.
- Keep `npm audit` clean.
- Tag releases with semantic versions such as `v0.1.0`.
- Sign builds before promoting the app widely.
