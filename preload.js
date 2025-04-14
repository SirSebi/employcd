const { contextBridge, ipcRenderer } = require('electron');

// Expose geschützte Methoden, die es erlauben, den Renderer-Prozess
// mit dem Hauptprozess zu verbinden
contextBridge.exposeInMainWorld(
  'api', {
    // Von Renderer zum Hauptprozess (Hauptprozess-Empfänger)
    send: (channel, data) => {
      // Whitelist von erlaubten Kanälen
      let validChannels = ['toMain'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    // Von Hauptprozess zum Renderer (Renderer-Empfänger)
    receive: (channel, func) => {
      let validChannels = ['fromMain'];
      if (validChannels.includes(channel)) {
        // Absichtlich "ersetzen", da ein Renderer keine Mehrfachempfänger haben sollte
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
); 