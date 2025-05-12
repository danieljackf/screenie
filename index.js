const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle screenshot request
ipcMain.handle('take-screenshot', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  // Select the first screen (you can add logic to choose a specific screen)
  const screen = sources[0];

  const screenshotPath = path.join(app.getPath('desktop'), 'screenshot.png');
  const image = screen.thumbnail.toPNG();

  fs.writeFileSync(screenshotPath, image);

  return screenshotPath;
});