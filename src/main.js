const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('renamedChapter', (event, message) => {
  let focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.close();
  let parentWindow = BrowserWindow.getFocusedWindow();
  parentWindow.webContents.send('renamedChapter', message);
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})