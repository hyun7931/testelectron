const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let wss;

function startServer() {
    wss = new WebSocket.Server({ port: 8080 });
    
    wss.on('connection', (ws) => {
        console.log('[Electron] 크롬 익스텐션 연결');
        
        ws.on('close', () => {
            console.log('[Electron] 연결 끊김');
        });
    });
}

function sendCommandToChrome(url) {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'OPEN_TAB', url: url }));
        }
    });
}

app.whenReady().then(() => {
    startServer();

    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.on('trigger-chrome', (event, url) => {
    console.log(`[Electron] 명령 전송: ${url}`);
    sendCommandToChrome(url);
});