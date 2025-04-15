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

## Supabase-Authentifizierung einrichten

Die Anwendung verwendet Supabase für die Authentifizierung und Abonnementverwaltung. Folgen Sie diesen Schritten, um Ihre eigene Supabase-Instanz einzurichten:

1. Erstellen Sie ein kostenloses Konto auf [Supabase](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Kopieren Sie Ihre Supabase-URL und Ihren Anon-Key aus den Projekteinstellungen
4. Kopieren Sie `.env.local.example` nach `.env.local` und tragen Sie Ihre Supabase-Daten ein:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihre-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
SUPABASE_SERVICE_KEY=ihr-service-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Einrichtung der Datenbank mit dem bereitgestellten SQL-Skript:
   - Navigieren Sie zu Ihrem Supabase-Projekt → SQL-Editor
   - Laden Sie den Inhalt von `scripts/setup-database.sql` und führen Sie ihn aus
   - Oder führen Sie die einzelnen SQL-Anweisungen aus der Datei `docs/database.md` aus

6. (Optional) Testdaten einfügen:
   ```bash
   node scripts/seed-test-data.js
   ```
   Dieses Skript erstellt Testbenutzer und Abonnements für die Entwicklung.

## Datenbankdokumentation

Die vollständige Dokumentation der Datenbankstruktur und -funktionen finden Sie in der Datei [docs/database.md](docs/database.md). Dort sind alle Tabellen, Felder, Beziehungen und SQL-Anweisungen dokumentiert.

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
- `lib/supabase.ts`: Supabase-Client und Authentifizierungsfunktionen
- `lib/auth.ts`: Authentifizierungslogik und Token-Management
- `lib/auth-context.tsx`: React-Kontext für Authentifizierungsstatus
- `docs/`: Dokumentationen, einschließlich Datenbankstruktur
- `scripts/`: Hilfsskripte für Entwicklung und Datenbankverwaltung

## Technologien

- React
- Next.js
- Electron
- Tailwind CSS
- Supabase (Authentifizierung und Datenbank)
- JWT für sichere Tokenverarbeitung 