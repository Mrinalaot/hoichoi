const {app, BrowserWindow, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const { download } = require('electron-dl')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1280, height: 720, frame: false, titleBarStyle: 'hidden'})

  mainWindow.loadFile('public/index.html')

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function startMonit() {
  if (isDev) {
    const elemon = require('elemon')
    elemon({
      app: app,
      mainFile: 'main.js',
      bws: [
        { bw: mainWindow, res: [] }
      ]
    })
    console.log('Hot reloading...')
  }
}

app.on('ready', function() {
  createWindow()

  startMonit()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('download-video', async (e, data) => {
  const win = BrowserWindow.getFocusedWindow();
 	console.log(await download(win, data.source.src, {
     saveAs: true,
     filename: data.title
   }));
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
