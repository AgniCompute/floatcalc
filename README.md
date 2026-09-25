# FloatCalc

A simple Windows desktop calculator with a **Pin** setting that keeps it above your browser and other windows.

## Why This Exists

Windows Calculator can disappear behind your browser when you switch windows. FloatCalc solves that with an always-on-top mode.

## Features

- Basic calculator operations
- Keyboard support
- Draggable compact window
- Pin/lock toggle to keep the calculator on top
- Windows installer and portable app builds
- Microsoft Store/AppX build path
- GitHub Releases workflow

## Download For Normal Users

Go to the project's GitHub **Releases** page and download one of these files:

- `FloatCalc-0.1.0-x64.exe` for the installer
- `FloatCalc-Portable-0.1.0-x64.exe` for the portable build

Windows may show a warning until the app is code signed. Click **More info** and **Run anyway** only if you downloaded it from the official repo.

See [docs/distribution.md](./docs/distribution.md) for the full release path.
See [docs/microsoft-store.md](./docs/microsoft-store.md) for the Microsoft Store release path.

## Run From Source

```bash
npm install
npm run dev
```

## Build The Windows App

```bash
npm install
npm run build
```

The installer is created in:

```text
release/
```

To build the portable app:

```bash
npm run build:portable
```

The portable app is created in:

```text
release-portable/
```

## Developer Checks

```bash
npm run lint
```

## Build For Microsoft Store

First replace the Partner Center placeholders in `package.json`, then run:

```bash
npm run build:store:x64
```

## Release Checklist

1. Replace `YOUR_GITHUB_USERNAME` in `package.json`.
2. Update the version in `package.json`.
3. Run `npm install`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Optional: run `npm run build:portable`.
7. Upload the installer from `release/` and optional portable app from `release-portable/` to GitHub Releases.

For automatic releases, push a tag like:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT
