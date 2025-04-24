const { app, BrowserWindow } = require("electron");

const express = require("./index"); //your express app

app.on("ready", function () {
  express();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
  });
  mainWindow.loadURL("http://localhost:3000/control-panel");
  mainWindow.focus();
});

