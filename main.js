const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Behalte eine globale Referenz auf das Fenster-Objekt.
// Wenn du das nicht tust, wird das Fenster automatisch geschlossen,
// sobald das JavaScript-Objekt Garbage Collected wird.
let mainWindow;

// Bestimme, ob wir im Entwicklungsmodus sind
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  // Fenstergröße für Ausweise: 2415 x 1544 Pixel
  const ausweisBreite = 2415;
  const ausweisHoehe = 1544;
  
  // Bildschirm-Objekt abrufen, um Bildschirmgröße zu ermitteln
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Skalierungsfaktor berechnen, wenn der Bildschirm kleiner ist als die Ausweisgröße
  let zoomFaktor = 1;
  if (width < ausweisBreite || height < ausweisHoehe) {
    const horizontalZoom = width / ausweisBreite;
    const vertikalZoom = height / ausweisHoehe;
    zoomFaktor = Math.min(horizontalZoom, vertikalZoom) * 0.9; // 10% Rand
  }
  
  // Erstelle das Browser-Fenster mit der spezifischen Größe für Ausweise
  mainWindow = new BrowserWindow({
    width: Math.min(ausweisBreite, width * 0.9), // Maximal 90% der Bildschirmbreite
    height: Math.min(ausweisHoehe, height * 0.9), // Maximal 90% der Bildschirmhöhe
    minWidth: Math.min(ausweisBreite / 2, width * 0.5), // Minimale Breite
    minHeight: Math.min(ausweisHoehe / 2, height * 0.5), // Minimale Höhe
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    center: true, // Zentriere das Fenster
    title: 'EmployCD - Ausweisgenerator', // Fenstertitel
  });
  
  // Zoom-Faktor einstellen, wenn der Bildschirm zu klein ist
  if (zoomFaktor < 1) {
    mainWindow.webContents.setZoomFactor(zoomFaktor);
  }

  // Bestimme die URL basierend auf der Umgebung
  const startUrl = isDev
    ? 'http://localhost:3000'  // Im Dev-Modus auf den Next.js-Server zugreifen
    : url.format({             // Im Produktionsmodus die exportierte HTML-Datei laden
        pathname: path.join(__dirname, './out/index.html'),
        protocol: 'file:',
        slashes: true
      });

  // Lade die Index-Seite der App.
  mainWindow.loadURL(startUrl);

  // Öffne die DevTools im Entwicklungsmodus.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereferenziere das Fenster-Objekt, normalerweise würdest du Fenster
    // in einem Array speichern, falls deine App mehrere Fenster unterstützt.
    // Das ist der Zeitpunkt, zu dem du das entsprechende Element löschen solltest.
    mainWindow = null;
  });
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und bereit ist, ein Fenster zu erstellen.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(createWindow);

// Beende, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', function() {
  // Unter macOS ist es üblich, für Apps und ihre Menüleiste
  // aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // Unter macOS ist es üblich, ein neues Fenster zu erstellen, wenn 
  // das Dock-Icon angeklickt wird und keine anderen Fenster offen sind.
  if (mainWindow === null) createWindow();
});

// In dieser Datei kannst du den Rest des App-spezifischen 
// Hauptprozess-Codes einbinden. Du kannst den Code auch 
// auf mehrere Dateien aufteilen und diese hier einbinden. 