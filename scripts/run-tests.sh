#!/bin/bash

# Dieses Skript führt alle Testskripte nacheinander aus

echo "===== EmployCD Testskripte ====="

# Prüfen, ob der Service-Key gesetzt ist
if grep -q "HIER_SERVICE_KEY_EINFÜGEN" .env.local; then
  echo "FEHLER: Sie müssen den SUPABASE_SERVICE_KEY in der .env.local-Datei setzen!"
  echo "Gehen Sie zu Projekteinstellungen → API → Project API keys → service_role"
  exit 1
fi

# Hinweis zur Datenbankeinrichtung
echo ""
echo "HINWEIS: Stellen Sie sicher, dass Sie das SQL-Setup-Skript in Supabase ausgeführt haben:"
echo "1. Gehen Sie zur Supabase-Konsole → SQL-Editor"
echo "2. Führen Sie den Inhalt von scripts/setup-database.sql aus"
echo "3. Falls Sie Fehler erhalten haben, führen Sie es erneut aus, nachdem Sie die Tabelle gelöscht haben"
echo ""
read -p "Haben Sie die Datenbank eingerichtet? (j/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Jj]$ ]]; then
  echo "Bitte richten Sie zuerst die Datenbank ein."
  exit 1
fi

# Script-Verzeichnis als ausführbar markieren
chmod +x scripts/*.js

echo ""
echo "1. Testdaten einfügen..."
node scripts/seed-test-data.js
SEED_RESULT=$?

if [ $SEED_RESULT -ne 0 ]; then
  echo "FEHLER: Seeding fehlgeschlagen. Bitte überprüfen Sie die Fehlermeldungen oben."
  exit 1
fi

echo ""
echo "2. Abonnement-Status anzeigen..."
echo "Admin-Benutzer:"
node scripts/manage-subscriptions.js status admin@example.com

echo ""
echo "Aktiver Benutzer:"
node scripts/manage-subscriptions.js status activeuser@example.com

echo ""
echo "Abgelaufener Benutzer:"
node scripts/manage-subscriptions.js status expireduser@example.com

echo ""
echo "Testskripte erfolgreich ausgeführt!"
echo "Sie können nun die Anwendung starten und sich mit einem der Testbenutzer anmelden:"
echo "- E-Mail: admin@example.com, Passwort: securepassword123 (Administrator)"
echo "- E-Mail: activeuser@example.com, Passwort: securepassword123 (Aktives Abonnement)"
echo "- E-Mail: expireduser@example.com, Passwort: securepassword123 (Abgelaufenes Abonnement)" 