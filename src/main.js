const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const os = require("node:os");
const path = require("node:path");

let mainWindow;

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("disable-gpu-sandbox");
app.commandLine.appendSwitch("disable-software-rasterizer");
app.commandLine.appendSwitch("disable-features", "DawnGraphite");
app.commandLine.appendSwitch("no-sandbox");
app.disableHardwareAcceleration();

if (!app.isPackaged) {
  app.setPath("userData", path.join(os.tmpdir(), "floatcalc-dev"));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 560,
    minWidth: 320,
    minHeight: 480,
    backgroundColor: "#111827",
    title: "FloatCalc",
    frame: false,
    titleBarStyle: "hidden",
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("window:minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window:close", () => {
  mainWindow?.close();
});

ipcMain.handle("window:toggle-lock", () => {
  if (!mainWindow) {
    return false;
  }

  const nextState = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(nextState, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(nextState, { visibleOnFullScreen: true });

  return nextState;
});

ipcMain.handle("window:get-lock-state", () => {
  return mainWindow?.isAlwaysOnTop() ?? false;
});
