# EmployCD - Datenbankdokumentation

Diese Dokumentation beschreibt die Datenbankstrukturen, die in der EmployCD-Anwendung verwendet werden. Wir nutzen Supabase als Datenbank- und Authentifizierungsplattform.

## Übersicht

Die Datenbank ist in folgende Hauptbereiche unterteilt:

1. **Authentifizierung**: Verwaltet durch Supabase Auth
2. **Abonnements**: Speichert Informationen zu Benutzerabonnements
3. **Anwendungsdaten**: Spezifische Daten für die EmployCD-Anwendung

## Authentifizierung (Supabase Auth)

Die Authentifizierung wird über den integrierten Supabase Auth-Service verwaltet. Dieser speichert Benutzerinformationen in der `auth.users`-Tabelle.

### auth.users

Diese Tabelle wird automatisch von Supabase verwaltet und enthält grundlegende Benutzerinformationen.

| Spalte          | Typ                     | Beschreibung                                    |
|-----------------|-------------------------|------------------------------------------------|
| id              | uuid                    | Primärschlüssel, eindeutige Benutzer-ID        |
| email           | varchar                 | E-Mail-Adresse des Benutzers (eindeutig)       |
| encrypted_password | varchar              | Verschlüsseltes Passwort                       |
| email_confirmed_at | timestamptz          | Zeitpunkt der E-Mail-Bestätigung               |
| last_sign_in_at | timestamptz            | Zeitpunkt der letzten Anmeldung                |
| raw_app_meta_data | jsonb                 | Anwendungsspezifische Metadaten               |
| raw_user_meta_data | jsonb                | Benutzerspezifische Metadaten                  |
| created_at      | timestamptz            | Erstellungszeitpunkt                          |
| updated_at      | timestamptz            | Aktualisierungszeitpunkt                      |

**Hinweis:** `raw_user_meta_data` kann folgende benutzerdefinierte Felder enthalten:
- `name`: Anzeigename des Benutzers
- `role`: Rolle des Benutzers (z.B. "user", "admin")

## Abonnements

### subscriptions

Diese Tabelle speichert Informationen zu Benutzerabonnements.

| Spalte          | Typ                     | Beschreibung                                    |
|-----------------|-------------------------|------------------------------------------------|
| id              | uuid                    | Primärschlüssel, eindeutige Abonnement-ID      |
| user_id         | uuid                    | Fremdschlüssel auf auth.users.id               |
| status          | text                    | Status des Abonnements (active, canceled, expired) |
| plan_id         | text                    | ID des Abonnementplans                         |
| created_at      | timestamptz            | Erstellungszeitpunkt                          |
| expires_at      | timestamptz            | Ablaufzeitpunkt des Abonnements               |
| metadata        | jsonb                   | Zusätzliche Metadaten zum Abonnement          |

**Indizes:**
- `user_id`: Beschleunigt Suche nach Benutzerabonnements

**Beispiel für metadata-Feld:**
```json
{
  "payment_id": "pay_123456789",
  "payment_provider": "stripe",
  "features": ["feature1", "feature2"],
  "custom_limits": {
    "storage": 10,
    "users": 5
  }
}
```

**Row Level Security (RLS):**
- Benutzer können nur ihre eigenen Abonnements lesen
- Nur Administratoren können Abonnements erstellen/aktualisieren

## Anwendungsstruktur der Authentifizierung

Die folgenden Komponenten arbeiten mit den Datenbankstrukturen:

### lib/supabase.ts
Stellt die grundlegenden Funktionen zur Kommunikation mit Supabase bereit:
- `signInUser`: Authentifiziert Benutzer mit E-Mail und Passwort
- `getCurrentUser`: Ruft aktuelle Benutzerinformationen ab
- `getUserSubscription`: Ruft Abonnementinformationen eines Benutzers ab
- `hasActiveSubscription`: Prüft, ob ein Benutzer ein aktives Abonnement hat

### lib/auth.ts
Implementiert die Authentifizierungslogik mit Token-Management:
- `saveToken`: Speichert Token sicher in Electron
- `getToken`: Ruft Token aus dem sicheren Speicher ab
- `getUser`: Ruft Benutzer mit Abonnementinformationen ab
- `loginUser`: Authentifiziert Benutzer und speichert Token

### lib/auth-context.tsx
Stellt React-Context für Authentifizierungsstatus bereit:
- `useAuth`: Hook zum Zugriff auf Authentifizierungsdaten
- `AuthProvider`: Provider-Komponente für Authentifizierungskontext

## SQL-Anweisungen zur Einrichtung

### Abonnement-Tabelle erstellen

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  plan_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  metadata JSONB
);

-- Index für schnelle Abfragen nach Benutzer-ID
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);

-- Row Level Security (RLS) für Datenschutz
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Richtlinie: Benutzer können nur ihre eigenen Abonnements lesen
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Richtlinie: Nur Administratoren können Abonnements erstellen
CREATE POLICY "Only admins can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Richtlinie: Nur Administratoren können Abonnements aktualisieren
CREATE POLICY "Only admins can update subscriptions"
  ON subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Automatische Aktualisierung von abgelaufenen Abonnements
CREATE OR REPLACE FUNCTION update_expired_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  -- Prüfen, ob Abonnement abgelaufen ist und aktiv
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status = 'active' AND NEW.expires_at < NOW() THEN
      NEW.status := 'expired';
    END IF;
    RETURN NEW;
  ELSE -- INSERT Fall
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatische Statusaktualisierung
CREATE TRIGGER trigger_update_expired_subscriptions
BEFORE INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_expired_subscriptions();
```

## Beispiel-Abfragen

### Aktive Abonnements abrufen

```sql
SELECT u.email, s.plan_id, s.expires_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'active' AND s.expires_at > now();
```

### Abgelaufene Abonnements identifizieren

```sql
SELECT u.email, s.plan_id, s.expires_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.expires_at < now() AND s.status != 'expired';
```

### Benutzer ohne Abonnement finden

```sql
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE s.id IS NULL;
```

## Sicherheitshinweise

1. **Datenspeicherung**: Sensitive Daten werden verschlüsselt in der Datenbank gespeichert
2. **API-Zugriff**: Supabase RLS (Row Level Security) schützt Daten vor unberechtigtem Zugriff
3. **Token-Management**: JWTs werden sicher im Electron-Prozess gespeichert

## Migrationen und Datenbankänderungen

Bei Änderungen an der Datenbankstruktur sollte diese Dokumentation aktualisiert werden. Zukünftige Migrationen werden hier dokumentiert.

### Migration 001 - Basisstruktur (Datum: [TBD])

Status: Implementiert

- Erstellung der Authentifizierungsstruktur
- Erstellung der Abonnementtabelle

### Migration 002 - [Zukünftige Änderung] (Datum: [TBD])

Status: Geplant

- [Beschreibung der geplanten Änderungen] 