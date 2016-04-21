'use strict';

/**
 * Module dependencies.
 */
const electron = require('electron');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname);
    require('electron-debug')({ showDevTools: true });
}

let mainWindow;

/**
 * Create the main browser window.
 */
let createWindow = () => {
    mainWindow = new electron.BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadURL(path.join('file://', __dirname, 'app/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

/**
 * App.
 */
electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

electron.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
