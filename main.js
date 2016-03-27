'use strict';

/**
 * Module dependencies.
 */
const electron = require('electron');
const app = electron.app;
const path = require('path');
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
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
