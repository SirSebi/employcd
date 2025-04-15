#!/usr/bin/env node

/**
 * Dieses Skript fügt Testdaten in die Supabase-Datenbank ein.
 * Es erstellt Testbenutzer und Abonnements für Entwicklungszwecke.
 * 
 * Verwendung:
 * 1. Kopieren Sie .env.local.example nach .env.local und tragen Sie Ihre Supabase-Daten ein
 * 2. Führen Sie 'node scripts/seed-test-data.js' aus
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Umgebungsvariablen laden
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Ein Service-Key wird benötigt, nicht der Anon-Key!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Fehler: Supabase-Umgebungsvariablen fehlen!');
  console.error('Bitte stellen Sie sicher, dass NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_KEY in .env.local definiert sind.');
  process.exit(1);
}

// Supabase-Client mit Service-Key erstellen (für Admin-Zugriff)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Testdaten
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'securepassword123',
    userData: {
      name: 'Admin Benutzer',
      role: 'admin'
    }
  },
  {
    email: 'activeuser@example.com',
    password: 'securepassword123',
    userData: {
      name: 'Aktiver Benutzer',
      role: 'user'
    },
    subscription: {
      status: 'active',
      plan_id: 'basic',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 Jahr
      metadata: {
        payment_id: 'test_payment_1',
        features: ['feature1', 'feature2']
      }
    }
  },
  {
    email: 'expireduser@example.com',
    password: 'securepassword123',
    userData: {
      name: 'Abgelaufener Benutzer',
      role: 'user'
    },
    subscription: {
      status: 'expired',
      plan_id: 'basic',
      expires_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 Tage in der Vergangenheit
      metadata: {
        payment_id: 'test_payment_2',
        features: ['feature1']
      }
    }
  }
];

/**
 * Benutzer erstellen und ggf. ein Abonnement hinzufügen
 */
async function createUserWithSubscription(userData) {
  console.log(`Erstelle Benutzer: ${userData.email}...`);
  
  // Suche nach bestehenden Benutzern über die Admin-API
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
    filter: { email: userData.email }
  });
  
  if (listError) {
    console.error(`  Fehler beim Suchen nach bestehendem Benutzer:`, listError.message);
    return;
  }
  
  let userId;
  const existingUser = existingUsers.users.find(u => u.email === userData.email);
  
  if (existingUser) {
    console.log(`  Benutzer ${userData.email} existiert bereits, überspringe...`);
    userId = existingUser.id;
  } else {
    try {
      // Neuen Benutzer erstellen
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.userData,
        email_confirm: true // E-Mail-Bestätigung überspringen
      });
      
      if (createError) {
        console.error(`  Fehler beim Erstellen des Benutzers ${userData.email}:`, createError.message);
        return;
      }
      
      console.log(`  Benutzer ${userData.email} erfolgreich erstellt!`);
      userId = newUser.user.id;
    } catch (err) {
      console.error(`  Unerwarteter Fehler beim Erstellen des Benutzers:`, err.message);
      return;
    }
  }
  
  // Abonnement hinzufügen, wenn angegeben
  if (userData.subscription && userId) {
    await addSubscription(userId, userData.email, userData.subscription);
  }
}

/**
 * Separierte Funktion zum Hinzufügen eines Abonnements
 */
async function addSubscription(userId, email, subscriptionData) {
  console.log(`  Füge Abonnement für ${email} hinzu...`);
  
  try {
    // Prüfen, ob bereits ein Abonnement existiert
    const { data: existingSub, error: queryError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (queryError) {
      console.error(`  Fehler beim Überprüfen bestehender Abonnements:`, queryError.message);
      return;
    }
    
    if (existingSub) {
      // Vorhandenes Abonnement aktualisieren
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: subscriptionData.status,
          plan_id: subscriptionData.plan_id,
          expires_at: subscriptionData.expires_at.toISOString(),
          metadata: subscriptionData.metadata
        })
        .eq('id', existingSub.id);
      
      if (updateError) {
        console.error(`  Fehler beim Aktualisieren des Abonnements:`, updateError.message);
        return;
      }
      
      console.log(`  Abonnement für ${email} aktualisiert!`);
    } else {
      // Neues Abonnement erstellen
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: subscriptionData.status,
          plan_id: subscriptionData.plan_id,
          expires_at: subscriptionData.expires_at.toISOString(),
          metadata: subscriptionData.metadata
        });
      
      if (insertError) {
        console.error(`  Fehler beim Hinzufügen des Abonnements:`, insertError.message);
        return;
      }
      
      console.log(`  Abonnement für ${email} erstellt!`);
    }
  } catch (err) {
    console.error(`  Unerwarteter Fehler beim Verwalten des Abonnements:`, err.message);
  }
}

/**
 * Alle Testbenutzer erstellen
 */
async function seedDatabase() {
  console.log('=== Starte Datenbank-Seeding ===');
  
  // Nacheinander verarbeiten, um Race-Conditions zu vermeiden
  for (const user of testUsers) {
    await createUserWithSubscription(user);
  }
  
  console.log('=== Datenbank-Seeding abgeschlossen ===');
}

// Skript ausführen
seedDatabase()
  .catch(error => {
    console.error('Fehler beim Seeding der Datenbank:', error);
  })
  .finally(() => {
    process.exit(0);
  }); 