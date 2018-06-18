import { app, BrowserWindow } from 'electron' // eslint-disable-line
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import express from 'express';
import path from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

// Setup express server and expose json endpoint to fetch mails
const expressApp = express();
const mails = [];
expressApp.get('/mails.json', (req, res) => res.json(mails));

// Format email headers
function formatHeaders(headers) {
  const result = {};
  headers.forEach((key, value) => { result[key] = value; });
  return result;
}

// Parse email stream using mailparser
function parseEmail(stream) {
  return simpleParser(stream).then((email) => {
    email.headers = formatHeaders(email.headers);
    return email;
  });
}

// Create an SMTP server and parse email info
const smtpServer = new SMTPServer({
  authOptional: true,
  maxAllowedUnauthenticatedCommands: 1000,
  onData(stream, session, callback) {
    parseEmail(stream).then(
      (mail) => {
        mails.unshift(mail);
        callback();
      },
      callback,
    );
  },
});

// Register smtp server callbacks
smtpServer.on('error', (err) => {
  console.log(err);
});
smtpServer.listen(1025, '0.0.0.0');

let mainWindow;

function createWindow() {
  const serverAddr = 'http://localhost:5000';
  const serverPort = 5000;

  // Start an express server at serverAddr
  expressApp.listen(serverPort, () => console.log(path.join('Express app running at ', serverAddr)));

  // Load electron browser window
  const openWindow = function () {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => { mainWindow = null; });
  };
  openWindow();
}

// Register electron callbacks
app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
