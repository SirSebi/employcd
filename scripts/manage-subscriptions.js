#!/usr/bin/env node

/**
 * Dieses Skript ermöglicht die Verwaltung von Benutzerabonnements.
 * Es kann verwendet werden, um Abonnements zu verlängern, zu kündigen oder den Status zu ändern.
 * 
 * Verwendung:
 * - Abonnementstatus für einen Benutzer anzeigen:
 *   node scripts/manage-subscriptions.js status user@example.com
 * 
 * - Abonnement verlängern:
 *   node scripts/manage-subscriptions.js extend user@example.com 365
 * 
 * - Abonnement kündigen:
 *   node scripts/manage-subscriptions.js cancel user@example.com
 * 
 * - Abonnement aktivieren:
 *   node scripts/manage-subscriptions.js activate user@example.com basic 365
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Umgebungsvariablen laden
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\x1b[31mFehler: Supabase-Umgebungsvariablen fehlen.\x1b[0m');
  console.log('Bitte stellen Sie sicher, dass die folgenden Umgebungsvariablen in .env.local gesetzt sind:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_KEY (Service-Rolle Key)');
  process.exit(1);
}

// Supabase-Client mit Service-Key erstellen
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Befehlszeilenargumente verarbeiten
const [,, command, email, ...args] = process.argv;

// Befehlsoptionen
const commands = ['status', 'extend', 'cancel', 'activate'];

// Hilfetext anzeigen, wenn kein oder ein ungültiger Befehl angegeben wurde
if (!command || !commands.includes(command)) {
  console.log('\x1b[1mVerwendung:\x1b[0m node manage-subscriptions.js <Befehl> <E-Mail> [Optionen]');
  console.log('\n\x1b[1mVerfügbare Befehle:\x1b[0m');
  console.log('  status <E-Mail>               - Abonnement-Status eines Benutzers anzeigen');
  console.log('  extend <E-Mail> <Tage>        - Abonnement um X Tage verlängern');
  console.log('  cancel <E-Mail>               - Abonnement stornieren');
  console.log('  activate <E-Mail> <Tage>      - Abonnement aktivieren für X Tage');
  console.log('\n\x1b[1mBeispiele:\x1b[0m');
  console.log('  node manage-subscriptions.js status user@example.com');
  console.log('  node manage-subscriptions.js extend user@example.com 30');
  console.log('  node manage-subscriptions.js activate user@example.com 14');
  process.exit(1);
}

// E-Mail auf Gültigkeit prüfen
if (!email || !email.includes('@')) {
  console.error('\x1b[31mFehler: Bitte geben Sie eine gültige E-Mail-Adresse an.\x1b[0m');
  process.exit(1);
}

async function main() {
  try {
    console.log(`\x1b[34mBenutzer mit E-Mail ${email} wird gesucht...\x1b[0m`);
    
    // Benutzer über Admin API suchen
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('\x1b[31mFehler beim Abrufen der Benutzerdaten:\x1b[0m', usersError.message);
      process.exit(1);
    }
    
    const user = usersData.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`\x1b[31mBenutzer mit E-Mail "${email}" nicht gefunden.\x1b[0m`);
      console.log('Bitte überprüfen Sie die E-Mail-Adresse oder erstellen Sie zuerst den Benutzer.');
      process.exit(1);
    }
    
    const userId = user.id;
    console.log(`\x1b[32mBenutzer gefunden (ID: ${userId})\x1b[0m`);
    
    // Aktuelle Abonnementdaten abrufen
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('\x1b[31mFehler beim Abrufen des Abonnements:\x1b[0m', subscriptionError.message);
      process.exit(1);
    }
    
    // Befehl ausführen
    switch (command) {
      case 'status':
        await showStatus(userId, subscription);
        break;
      case 'extend':
        await extendSubscription(userId, subscription, args[0]);
        break;
      case 'cancel':
        await cancelSubscription(userId, subscription);
        break;
      case 'activate':
        await activateSubscription(userId, subscription, args[0]);
        break;
    }
    
  } catch (error) {
    console.error('\x1b[31mUnerwarteter Fehler:\x1b[0m', error.message);
    process.exit(1);
  }
}

async function showStatus(userId, subscription) {
  if (!subscription) {
    console.log(`\x1b[33mBenutzer hat kein Abonnement.\x1b[0m`);
    return;
  }
  
  const now = new Date();
  const expiry = new Date(subscription.expires_at);
  const isActive = subscription.status === 'active' && expiry > now;
  const daysLeft = isActive ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : 0;
  
  console.log('\x1b[1mAbonnement-Details:\x1b[0m');
  console.log(`Status: ${subscription.status === 'active' ? '\x1b[32mAktiv\x1b[0m' : '\x1b[31mInaktiv\x1b[0m'}`);
  console.log(`Ablaufdatum: ${new Date(subscription.expires_at).toLocaleDateString()}`);
  
  if (isActive) {
    console.log(`Verbleibende Tage: \x1b[32m${daysLeft}\x1b[0m`);
  } else if (subscription.status === 'active') {
    console.log(`\x1b[33mAbonnement ist abgelaufen.\x1b[0m`);
  }
}

async function extendSubscription(userId, subscription, days) {
  if (!days || isNaN(parseInt(days))) {
    console.error('\x1b[31mFehler: Bitte geben Sie eine gültige Anzahl von Tagen an.\x1b[0m');
    process.exit(1);
  }
  
  days = parseInt(days);
  
  if (!subscription) {
    console.error('\x1b[31mFehler: Benutzer hat kein Abonnement zum Verlängern.\x1b[0m');
    console.log('Verwenden Sie stattdessen den "activate" Befehl, um ein neues Abonnement zu erstellen.');
    process.exit(1);
  }
  
  const currentExpiry = new Date(subscription.expires_at);
  const newExpiry = new Date(currentExpiry);
  newExpiry.setDate(newExpiry.getDate() + days);
  
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      expires_at: newExpiry.toISOString(),
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('\x1b[31mFehler beim Verlängern des Abonnements:\x1b[0m', error.message);
    process.exit(1);
  }
  
  console.log(`\x1b[32mAbonnement wurde erfolgreich um ${days} Tage verlängert.\x1b[0m`);
  console.log(`Neues Ablaufdatum: ${newExpiry.toLocaleDateString()}`);
}

async function cancelSubscription(userId, subscription) {
  if (!subscription) {
    console.log('\x1b[33mBenutzer hat kein Abonnement zum Stornieren.\x1b[0m');
    return;
  }
  
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('\x1b[31mFehler beim Stornieren des Abonnements:\x1b[0m', error.message);
    process.exit(1);
  }
  
  console.log('\x1b[32mAbonnement wurde erfolgreich storniert.\x1b[0m');
}

async function activateSubscription(userId, subscription, days) {
  if (!days || isNaN(parseInt(days))) {
    console.error('\x1b[31mFehler: Bitte geben Sie eine gültige Anzahl von Tagen an.\x1b[0m');
    process.exit(1);
  }
  
  days = parseInt(days);
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  if (subscription) {
    // Bestehendes Abonnement aktualisieren
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'active',
        expires_at: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('\x1b[31mFehler beim Aktivieren des Abonnements:\x1b[0m', error.message);
      process.exit(1);
    }
    
    console.log('\x1b[32mBestehendes Abonnement wurde erfolgreich aktiviert.\x1b[0m');
  } else {
    // Neues Abonnement erstellen
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'active',
        expires_at: expiryDate.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('\x1b[31mFehler beim Erstellen des Abonnements:\x1b[0m', error.message);
      process.exit(1);
    }
    
    console.log('\x1b[32mNeues Abonnement wurde erfolgreich erstellt.\x1b[0m');
  }
  
  console.log(`Ablaufdatum: ${expiryDate.toLocaleDateString()}`);
}

// Skript ausführen
main().catch(error => {
  console.error('\x1b[31mFehler bei der Ausführung:\x1b[0m', error.message);
  process.exit(1);
}); 