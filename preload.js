// Alle von Node, Electron, etc. bereitgestellten APIs sind über den Kontext des Preload-Skripts zugänglich.
// Sie sind auch über das `window`-Objekt im Renderer-Prozess zugänglich.
const { contextBridge, ipcRenderer } = require('electron');

// Füge APIs zum Renderer-Prozess hinzu
contextBridge.exposeInMainWorld('electron', {
  // Hier können sichere Kanäle für die IPC-Kommunikation zwischen Renderer und Main-Prozess erstellt werden
  send: (channel, data) => {
    // Whiteliste von Kanälen, die vom Renderer-Prozess verwendet werden können
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    // Whiteliste von Kanälen, die vom Renderer-Prozess empfangen werden können
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Entferne alten Listener, um doppelte Ereignisse zu vermeiden
      ipcRenderer.removeAllListeners(channel);
      // Füge neuen Listener hinzu
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// Falls benötigt, können hier weitere APIs oder Funktionalitäten hinzugefügt werden
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM vollständig geladen und geparst');
}); 