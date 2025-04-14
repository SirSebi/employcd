# EmployCD - Desktop-Anwendung

Diese Anwendung ist eine mit Electron gebaute Desktop-Version einer React/Next.js-Anwendung.

## Installation

Um die Anwendung zu entwickeln, führen Sie die folgenden Befehle aus:

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsmodus starten
npm run electron:dev
```

## Verfügbare Skripte

- `npm run dev`: Startet die Next.js-Anwendung im Entwicklungsmodus
- `npm run electron:dev`: Startet die Next.js-Anwendung und die Electron-App im Entwicklungsmodus
- `npm run electron:build`: Baut die Next.js-Anwendung und verpackt sie als Electron-App
- `npm run electron:start`: Startet die Electron-App (benötigt vorheriges Build)

## Bauen für verschiedene Plattformen

Die Anwendung kann für verschiedene Plattformen gebaut werden:

- **macOS**: `npm run electron:build`
- **Windows**: `npm run electron:build -- --win`
- **Linux**: `npm run electron:build -- --linux`

Die gebauten Anwendungen finden Sie im `dist`-Verzeichnis.

## Projektstruktur

- `main.js`: Electron-Hauptprozess
- `preload.js`: Preload-Skript für die Electron-App
- `app/`: Next.js-Anwendungscode
- `out/`: Exportierter Next.js-Build für Electron

## Technologien

- React
- Next.js
- Electron
- Tailwind CSS 