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
4. Erstellen Sie eine `.env.local`-Datei im Stammverzeichnis des Projekts mit folgenden Variablen:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihre-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Einrichtung der Abonnement-Datenbank in Supabase:
   - Erstellen Sie eine neue Tabelle namens `subscriptions` mit folgenden Spalten:
     - `id` (uuid, Primärschlüssel)
     - `user_id` (uuid, Fremdschlüssel auf auth.users)
     - `status` (text, z.B. 'active', 'canceled', 'expired')
     - `plan_id` (text)
     - `created_at` (timestamp with time zone, default: now())
     - `expires_at` (timestamp with time zone)
     - `metadata` (jsonb, optional für zusätzliche Daten)

6. Aktivieren Sie die E-Mail-Authentifizierung in den Supabase-Authentifizierungseinstellungen

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

## Technologien

- React
- Next.js
- Electron
- Tailwind CSS
- Supabase (Authentifizierung und Datenbank)
- JWT für sichere Tokenverarbeitung 