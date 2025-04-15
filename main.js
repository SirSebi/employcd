const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');

// Behalte eine globale Referenz auf das Fenster-Objekt.
// Wenn du das nicht tust, wird das Fenster automatisch geschlossen,
// sobald das JavaScript-Objekt Garbage Collected wird.
let mainWindow;

// Bestimme, ob wir im Entwicklungsmodus sind
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Generiert einen geheimen Schlüssel für die Verschlüsselung
// In einer Produktionsumgebung sollte dies sicherer gehandhabt werden
let encryptionKey;
try {
  const keyPath = path.join(app.getPath('userData'), 'secret.key');
  if (fs.existsSync(keyPath)) {
    encryptionKey = fs.readFileSync(keyPath, 'utf8');
  } else {
    encryptionKey = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(keyPath, encryptionKey);
  }
} catch (error) {
  console.error('Fehler beim Generieren des Verschlüsselungsschlüssels:', error);
  encryptionKey = 'fallback-encryption-key-for-development-only';
}

// Funktion zum Verschlüsseln von Daten
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Funktion zum Entschlüsseln von Daten
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Secure Storage IPC Handler
ipcMain.handle('secure-store-set', async (event, key, value) => {
  try {
    const encryptedValue = encrypt(value);
    const storagePath = path.join(app.getPath('userData'), 'secure-storage');
    
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(storagePath, key), encryptedValue);
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern verschlüsselter Daten:', error);
    return false;
  }
});

ipcMain.handle('secure-store-get', async (event, key) => {
  try {
    const storagePath = path.join(app.getPath('userData'), 'secure-storage', key);
    
    if (!fs.existsSync(storagePath)) {
      return null;
    }
    
    const encryptedValue = fs.readFileSync(storagePath, 'utf8');
    return decrypt(encryptedValue);
  } catch (error) {
    console.error('Fehler beim Lesen verschlüsselter Daten:', error);
    return null;
  }
});

ipcMain.handle('secure-store-delete', async (event, key) => {
  try {
    const storagePath = path.join(app.getPath('userData'), 'secure-storage', key);
    
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
    
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen verschlüsselter Daten:', error);
    return false;
  }
});

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