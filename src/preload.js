const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("calculatorWindow", {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  close: () => ipcRenderer.invoke("window:close"),
  toggleLock: () => ipcRenderer.invoke("window:toggle-lock"),
  getLockState: () => ipcRenderer.invoke("window:get-lock-state")
});
