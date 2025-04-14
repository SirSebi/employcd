const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Fensterreferenz global halten, um zu verhindern, dass das Fenster
// automatisch geschlossen wird, wenn das JavaScript-Objekt garbage collected wird
let mainWindow;

function createWindow() {
  // Erstelle das Browser-Fenster
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Lade die index.html der App
  mainWindow.loadFile('index.html');

  // Öffne die DevTools im Entwicklungsmodus
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Wird aufgerufen, wenn das Fenster geschlossen wird
  mainWindow.on('closed', function () {
    // Dereferenziere das Fenster-Objekt
    mainWindow = null;
  });
}

// Diese Methode wird aufgerufen, wenn Electron die Initialisierung
// abgeschlossen hat und bereit ist, Browser-Fenster zu erstellen
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // Auf macOS ist es üblich, die Anwendung und das Fenster neu zu erstellen,
    // wenn das Dock-Icon angeklickt wird und keine anderen Fenster geöffnet sind
    if (mainWindow === null) createWindow();
  });
});

// Beende die App, wenn alle Fenster geschlossen sind (außer auf macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Hier können Sie weitere App-spezifische Hauptprozesscode einfügen 