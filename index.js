const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 720,
  });

  mainWindow.loadFile("public/index.html");
});

app.on("quit", () => {
  app.quit();
});
