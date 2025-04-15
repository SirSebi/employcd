-- EmployCD Datenbankeinrichtung
-- Dieses Skript richtet die Datenbank für die EmployCD-Anwendung ein.
-- Es wird verwendet, um alle notwendigen Tabellen und Berechtigungen zu erstellen.

-- Erstelle die Abonnement-Tabelle
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  plan_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  metadata JSONB
);

-- Index für schnellere Abfragen nach Benutzer-ID
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id);

-- Row Level Security (RLS) für Datenschutz aktivieren
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Lösche vorhandene Richtlinien, falls sie existieren
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Only admins can insert subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Only admins can update subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Only admins can delete subscriptions" ON subscriptions;

-- Richtlinie: Benutzer können nur ihre eigenen Abonnements lesen
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Richtlinie: Nur Administratoren können neue Abonnements einfügen
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

-- Richtlinie: Nur Administratoren können Abonnements löschen
CREATE POLICY "Only admins can delete subscriptions"
  ON subscriptions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Testabonnement einfügen (optional, für Testzwecke)
-- Bitte ändern Sie die user_id auf eine gültige Benutzer-ID in Ihrer Datenbank
-- INSERT INTO subscriptions (user_id, status, plan_id, expires_at)
-- VALUES ('IHRE-BENUTZER-ID', 'active', 'basic', (CURRENT_TIMESTAMP + INTERVAL '1 year'));

-- Löschen Sie den alten Trigger und die alte Funktion, wenn sie existieren
DROP TRIGGER IF EXISTS trigger_update_expired_subscriptions ON subscriptions;
DROP FUNCTION IF EXISTS update_expired_subscriptions();

-- Erstellen Sie eine verbesserte Funktion zur Aktualisierung abgelaufener Abonnements
-- Diese Version verursacht keinen Stack Overflow
CREATE OR REPLACE FUNCTION update_expired_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  -- Prüfen, ob wir uns bereits in einer UPDATE-Operation befinden
  -- Dies verhindert einen rekursiven Aufruf, der zum Stack Overflow führt
  IF TG_OP = 'UPDATE' THEN
    -- Nur wenn wir nicht bereits dabei sind, den Status zu aktualisieren
    IF OLD.status = 'active' AND NEW.status = 'active' AND NEW.expires_at < NOW() THEN
      NEW.status := 'expired';
    END IF;
    RETURN NEW;
  ELSE -- INSERT Fall 
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Erstelle einen Trigger, der bei INSERT und UPDATE-Operationen ausgeführt wird
-- aber keinen rekursiven Stack Overflow verursacht
CREATE TRIGGER trigger_update_expired_subscriptions
BEFORE INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_expired_subscriptions();

-- Eine Beispiel-View für Administratoren, um alle aktiven Abonnements anzuzeigen
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT 
  u.email,
  s.id as subscription_id,
  s.plan_id,
  s.created_at,
  s.expires_at,
  s.status
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'active';

-- Berechtigungen für die View festlegen
ALTER VIEW active_subscriptions OWNER TO postgres;
GRANT SELECT ON active_subscriptions TO authenticated;
REVOKE SELECT ON active_subscriptions FROM anon;

-- Kommentar hinzufügen
COMMENT ON TABLE subscriptions IS 'Speichert Abonnementdaten für EmployCD-Benutzer'; 