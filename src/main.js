const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 540,
    minWidth: 310,
    minHeight: 460,
    frame: false,
    transparent: true,
    hasShadow: true,
    resizable: true,
    alwaysOnTop: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.handle("window:close", () => {
    mainWindow?.close();
  });

  ipcMain.handle("window:toggle-lock", () => {
    if (!mainWindow) return false;
    const nextState = !mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(nextState, "screen-saver");
    return nextState;
  });

  ipcMain.handle("window:get-lock-state", () => {
    return mainWindow ? mainWindow.isAlwaysOnTop() : false;
  });

  ipcMain.handle("window:set-opacity", (_event, opacity) => {
    if (!mainWindow) return;
    const val = Math.max(0.25, Math.min(1.0, Number(opacity) || 1.0));
    mainWindow.setOpacity(val);
  });

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
