import { autoUpdate } from "electron-updater";

("use strict");
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
// Prepare the renderer once the app is ready
electron_1.app.on("ready", async () => {
  await (0, electron_next_1.default)("./renderer");
  const mainWindow = new electron_1.BrowserWindow({
    width: 1000,
    minWidth: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: (0, path_1.join)(__dirname, "preload.js"),
    },
  });
  const url = electron_is_dev_1.default
    ? "http://localhost:8000/"
    : (0, url_1.format)({
        pathname: (0, path_1.join)(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });
  mainWindow.loadURL(url);
  // mainWindow.maximize();

  autoUpdate.checkForUpdatesAndNotify();
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", electron_1.app.quit);
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on("message", (event, message) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

autoUpdate.on("update-available", () => {});

autoUpdate.on("checking-for-update", () => {});

autoUpdate.on("download-progress", () => {});

autoUpdate.on("update-downloaded", () => {});
