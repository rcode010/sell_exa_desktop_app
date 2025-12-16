<<<<<<< HEAD
import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
=======
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import keytar
<<<<<<< HEAD
const keytar = require('keytar')

const SERVICE_NAME = 'SellExa'
const ACCOUNT_NAME = 'auth-token'

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
=======
const keytar = require("keytar");

const SERVICE_NAME = "SellExa";
const ACCOUNT_NAME = "auth-token";
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
<<<<<<< HEAD
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
=======
    // Production: load the index.html from the dist folder
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f
  }
  win.webContents.openDevTools();
}

<<<<<<< HEAD
ipcMain.handle('store-token', async (_event, token: string) => {
  try {
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token)
    return { success: true }
  } catch (error) {
    console.error('Failed to save token:', error)
    return { success: false, error }
  }
})

ipcMain.handle('get-token', async () => {
  try {
    const token = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME)
    return token
  } catch (error) {
    console.error('Failed to get token:', error)
    return null
  }
})

ipcMain.handle('delete-token', async () => {
  try {
    const deleted = await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME)
    return deleted
  } catch (error) {
    console.error('Failed to delete token:', error)
    return false
  }
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
=======
ipcMain.handle("store-token", async (_event, token: string) => {
  try {
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
    return { success: true };
  } catch (error) {
    console.error("Failed to save token:", error);
    return { success: false, error };
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f
  }
});

<<<<<<< HEAD
app.on('activate', () => {
=======
ipcMain.handle("get-token", async () => {
  try {
    const token = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    return token;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
});

ipcMain.handle("delete-token", async () => {
  try {
    const deleted = await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    return deleted;
  } catch (error) {
    console.error("Failed to delete token:", error);
    return false;
  }
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

<<<<<<< HEAD
app.whenReady().then(createWindow)
=======
app.whenReady().then(createWindow);
>>>>>>> 6adbd6189bfa8d1a22d0432c89cdc8407a50839f
