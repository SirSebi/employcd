# Meine Electron React App

Eine einfache Desktop-Anwendung, die mit Electron und React erstellt wurde.

## Funktionen

- Cross-Plattform: Läuft auf Windows, macOS und Linux
- Moderne Benutzeroberfläche mit React
- Einfache Benutzeroberfläche mit einem interaktiven Klick-Zähler
- Modernes Design mit responsivem Layout

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 14 oder höher)
- npm (wird mit Node.js installiert)

## Installation

1. Klone dieses Repository oder lade es herunter
2. Navigiere im Terminal zum Projektverzeichnis
3. Führe folgenden Befehl aus, um die Abhängigkeiten zu installieren:

```bash
npm install
```

## Entwicklung

Um die Anwendung im Entwicklungsmodus zu starten:

```bash
npm run dev
```

Dies kompiliert die React-Anwendung, überwacht Änderungen und startet die Electron-App mit geöffneten DevTools.

## Produktion

Um die Anwendung ohne DevTools zu starten:

```bash
npm run webpack && npm start
```

## Anwendung bauen

Um ausführbare Dateien für Ihr Betriebssystem zu erstellen:

```bash
npm run build
```

Die erstellten Dateien befinden sich dann im Verzeichnis `dist`.

## Projektstruktur

- `main.js` - Hauptprozess der Electron-Anwendung
- `preload.js` - Vermittelt sichere Kommunikation zwischen Renderer und Hauptprozess
- `index.html` - Einstiegspunkt für die React-Anwendung
- `src/renderer/` - React-Komponenten und Styles
  - `index.js` - Einstiegspunkt für React
  - `App.jsx` - Hauptkomponente der React-Anwendung
  - `App.css` - Styling für die Hauptkomponente
  - `styles.css` - Globales Styling 