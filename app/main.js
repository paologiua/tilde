const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
 
// Import getPreference() helper function
const getPreference = require('./js/helper/helper_global');
/*  
// Modules to create app tray icon
const Menu = require('electron').Menu
const Tray = require('electron').Tray
 */
// Create variables for appIcon, trayIcon, win
// to prevent their removal by garbage collection
/* let appIcon = null */
let trayIcon = null;
let win = null;

// Request lock to allow only one instance
// of the app running at the time.
const gotTheLock = app.requestSingleInstanceLock();
/* 
// Load proper icon for specific platform
if (process.platform === 'darwin') {
    trayIcon = path.join(__dirname, './img/tilde16x16.png')
} else if (process.platform === 'linux') {
    trayIcon = path.join(__dirname, './img/tilde.png')
} else if (process.platform === 'win32') {
    trayIcon = path.join(__dirname, './img/tilde.ico')
}
 */
// Load proper icon for specific platform
switch (process.platform) {
    case 'darwin':
        trayIcon = path.join(__dirname, './img/tilde16x16.png');
        break;
    case 'linux':
        trayIcon = path.join(__dirname, './img/tilde.png');
        break;
    case 'win32':
        trayIcon = path.join(__dirname, './img/tilde.ico');
        break;
}

function createWindow() {
	win = new BrowserWindow({
        width: 1100,
        minWidth: 1000,
        height: 640, 
        minHeight: (process.platform === 'win32' ? 635 : 600), 
        autoHideMenuBar: true,
        icon: trayIcon,
        frame: !(process.platform === "win32"),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            zoomFactor: 0.9
        },
        show: false
    });
    
    let darkMode = getPreference('darkmode');

    win.loadURL(url.format({
        pathname: path.join(__dirname, darkMode ? 'index-dark.html' : 'index.html'),
        protocol: 'file:',
        slashed: true
    }));

    win.setBackgroundColor(darkMode ? '#333' : '#fff');
    win.webContents.on('did-finish-load', function() {
        win.show();
    });
/* 
    // Create tray icon
    appIcon = new Tray(trayIcon)

    // Create RightClick context menu for tray icon
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Restore app',
            click: () => {
                win.show()
            }
        },
        {
            label: 'Close app',
            click: () => {
                win.close()
            }
        }
    ])

    // Set title for tray icon
    appIcon.setTitle('Tilde')

    // Set toot tip for tray icon
    appIcon.setToolTip('Tilde')

    // Create RightClick context menu
    appIcon.setContextMenu(contextMenu)

    // The tray icon is not destroyed
    appIcon.isDestroyed(false)

    // Restore (open) app after clicking on tray icon
    // if window is already open, minimize it to system tray
    appIcon.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
    })
 */
    win.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
/* 
    // Minimize window to system tray if 'Minimize' option is checked
    if (getPreference('minimize') === true) {
        win.on('minimize', function(event){
            event.preventDefault()
            // win.minimize()
            win.hide()
        })
    }
 */
    // Quit when all windows are closed
    win.on('window-all-closed', () => {
        app.quit();
    });

    win.on('closed', () => {
        app.quit();
    });

/*  // FUNCTIONS TO COMMUNICATE WITH THE RENDER
    function sendToRender(channel, obj) {
        const { ipcMain } = require('electron');
        win.send(channel, obj);
    }

    function listenFromRender(channel, f) {
        const { ipcMain } = require('electron');
        ipcMain.on(channel, async (event, obj) => {
            f(obj);
        });
    }
 */
}

// Check if this is first instance of the app running.
// If not, block it. If yes, allow it.
if(!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if(win) {
            if(win.isMinimized()) 
                win.restore();
            win.focus();
        }
    })

    // Create win, load the rest of the app, etc...
    app.on('ready', createWindow);
}
