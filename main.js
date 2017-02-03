// Copyright (c) The LHTML team
// See LICENSE for details.

const {app, BrowserWindow, Menu, protocol} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

//-------------------------------------------------------------------
// Logging
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
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
//-------------------------------------------------------------------
let win;
function createDefaultWindow() {
  win = new BrowserWindow();
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
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createDefaultWindow();
  }
});


//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
autoUpdater.on('checking-for-update', (ev) => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (ev) => {
  console.log('Update available.');
})
autoUpdater.on('update-not-available', (ev) => {
  console.log('Update not available.');
})
autoUpdater.on('error', (ev) => {
  console.log('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev) => {
  console.log('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, releaseNotes, releaseName, releaseDate, updateURL) => {
  console.log('Update downloaded.  Will quit and install in 5 seconds.');
  // Wait 5 seconds, then quit and install
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})
autoUpdater.checkForUpdates()