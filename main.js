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
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hello World', click: () => {
      showWindow();
      }
    },
    {
      label: 'Separator', type: 'separator'
    },
    { label: 'Help Centre', click: () => {
      showHelp();
      }},
      { label: 'Quit', click: () => {
        window.destroy();
        tray.destroy()}
      }
  ])
  tray.setToolTip('Hello World')
  tray.on('click', function (event) {
    toggleWindow()
  });
  tray.setContextMenu(contextMenu);
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  if (currentPlatform != 'LINUX'){
    // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x - (trayBounds.width / 2) + (windowBounds.width / 2) - 320);

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y - trayBounds.height - 440);

  return {x: x, y: y};
  }
  else{
    return {x: 1500, y: 5}
  }
  
}


//-40 in size for setting the constant value in position
const createWindow = () => {
  window = new BrowserWindow({
    width: 360,
    height: 480,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    skipTaskbar: true,
    scrollable: false,
    backgroundColor: '#fffafa',
    webPreferences: {
      backgroundThrottling: false,
      sandbox: false
    }
  })

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
  window.loadURL(`file://${path.join(__dirname, './app/index.html')}`)
  window.show();
}

const showHelp = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.loadURL(`file://${path.join(__dirname, './app/help.html')}`);
  window.show();
}

ipcMain.on('show-window', () => {
  showWindow()
})
