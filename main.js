// Copyright (c) The LHTML team
// See LICENSE for details.

const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;
function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}

app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

function sendStatus(text) {
  log.info(text);
  win.webContents.send('message', text);
}

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
autoUpdater.on('checking-for-update', () => {
  sendStatus('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatus('Update available.');
  log.info('info', info);
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatus('Update not available.');
  log.info('info', info);
})
autoUpdater.on('error', (ev, err) => {
  sendStatus('Error in auto-updater.');
  log.info('err', err);
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatus('Download progress...');
  log.info('progressObj', progressObj);
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatus('Update downloaded.  Will quit and install in 5 seconds.');
  log.info('info', info);
  // Wait 5 seconds, then quit and install
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})
// Wait a second for the window to exist before checking for updates.
setTimeout(function() {
  autoUpdater.checkForUpdates()  
}, 1000);
