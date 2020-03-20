const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const path = require('path');

let tray = undefined
let window = undefined

const os = require('os');
const platforms = {
  WINDOWS: 'WINDOWS',
  MAC: 'MAC',
  LINUX: 'LINUX'
}

const platformsNames = {
  win32: platforms.WINDOWS,
  darwin: platforms.MAC,
  linux: platforms.LINUX
}

const currentPlatform = platformsNames[os.platform()];

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(path.join('electorn-logo-2.png'))
  //let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  tray.on('click', function (event) {
    toggleWindow()
  });
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  if (currentPlatform != 'LINUX'){
    // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x - (trayBounds.width / 2) + (windowBounds.width / 2) - 250);

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y - trayBounds.height - 415);

  return {x: x, y: y};
  }
  else{
    return {x: 1000, y: 4}
  }
  
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 320,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    skipTaskbar: true,
    webPreferences: {
      backgroundThrottling: false,
      sandbox: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  //positioner.position(trayWindow, trayBounds, alignment);
  window.show();
}

ipcMain.on('show-window', () => {
  showWindow()
})
