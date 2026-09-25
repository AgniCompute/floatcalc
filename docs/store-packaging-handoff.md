# Store Packaging Handoff

## Goal

Publish FloatCalc through Microsoft Store so Microsoft hosts delivery, signs the
Store package, and manages updates.

## Store Identity Confirmed

These values came from Partner Center and are now in `package.json`:

```text
Identity name: ShaktiOS.FloatCalc
Publisher: CN=0E4D184F-8AB0-4561-9A62-93A756DCBC5B
```

## Changes Completed

- Changed Store build scripts from the unsupported `msix` target to
  electron-builder's supported `appx` target.
- Replaced the invalid `build.msix` configuration with `build.appx`.
- Added the confirmed Partner Center identity name, publisher, display name, and
  `en-US` language configuration.
- Updated the Store documentation to describe the actual `.appx` output.
- `npm run lint` passes.

The Store build command is:

```powershell
npm run build:store:x64
```

## Current Blocker

No `.appx` artifact was produced yet. The final MakeAppx packaging step fails
on this Windows installation:

```text
spawn UNKNOWN
```

Windows Event Log gives the actionable cause:

```text
Activation context generation failed for makeappx.exe.
Dependent Assembly Microsoft.Windows.Build.Appx.AppxPackaging.dll,
version="0.0.0.0" could not be found.
```

Microsoft documents that `MakeAppx.exe` is installed with the Windows SDK or
Visual Studio. Install the current Windows 10/11 SDK with AppX/MSIX packaging
tools, then verify a working executable exists under a path like:

```text
C:\Program Files (x86)\Windows Kits\10\bin\<sdk-version>\x64\makeappx.exe
```

Reference: https://learn.microsoft.com/en-us/windows/msix/package/create-app-package-with-makeappx-tool

After installing it, run `npm run build:store:x64` again. Expected output:

```text
release\FloatCalc-0.1.0-x64.appx
```

## Known Follow-Ups

- The build logs warn that it uses Electron's default icon. Add final Store logo
  assets before submission.
- `src/main.js` still carries local GPU and sandbox-disabling launch switches.
  Test Electron without them before Store certification; they remain a Store
  quality and security risk.
- The generated `release\win-unpacked` and `release\__appx-x64` folders are
  disposable build output from the failed attempt, not a deliverable.

## Important Constraint

Do not restore the old `build.msix` block or use `--win msix`: electron-builder
26.15.3 rejects that configuration. Its supported Store target is `appx`.
