const { app, BrowserWindow, ipcMain, Menu, screen } = require("electron");
const WebSocket = require("ws");
const path = require("path");

let widgetWindow = null;
let popupWindow = null;
let wss;

function startServer() {
  wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", (ws) => {
    console.log("[Electron] 크롬 익스텐션 연결");

    ws.on("close", () => {
      console.log("[Electron] 연결 끊김");
    });
  });
}

function createWidgetWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 60;
  const winHeight = 220;

  widgetWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 20,
    y: height - winHeight - 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: __dirname + "/preload.js",
    },
  });

  widgetWindow.loadFile("index.html");

  // 개발 중일 때만
  widgetWindow.webContents.openDevTools({ mode: "detach" });

  widgetWindow.on("closed", () => {
    widgetWindow = null;
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  startServer();
  createWidgetWindow();
});

/* 팝업 */
function createPopupWindow() {
  if (popupWindow) {
    popupWindow.focus();
    return;
  }

  popupWindow = new BrowserWindow({
    width: 400,
    height: 120,
    frame: true,
    alwaysOnTop: true,
    resizable: false,
    parent: widgetWindow, // 위젯 위에 뜨게
    modal: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  popupWindow.loadFile("popup.html");

  popupWindow.on("closed", () => {
    popupWindow = null;
  });
}

ipcMain.on("open-popup", () => {
  createPopupWindow();
});

/* 웹소켓 */
function sendCommandToChrome(url) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "OPEN_TAB", url: url }));
    }
  });
}

ipcMain.on("trigger-chrome", (event, url) => {
  console.log(`[Electron] 명령 전송: ${url}`);
  sendCommandToChrome(url);
});
