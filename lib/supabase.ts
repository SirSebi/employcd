import { createClient } from '@supabase/supabase-js';

// Verwende Umgebungsvariablen für die Supabase-Konfiguration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Überprüfe, ob die Umgebungsvariablen gesetzt sind
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase-Umgebungsvariablen fehlen! Bitte .env.local Datei prüfen.');
}

// Erstelle einen Supabase-Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hilfsfunktionen für die Authentifizierung
export const signUpUser = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData, // Zusätzliche Metadaten für den Benutzer
    },
  });
  
  return { data, error };
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Abonnement-bezogene Funktionen
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

// Prüft, ob ein Benutzer ein aktives Abonnement hat
export const hasActiveSubscription = async (userId: string) => {
  const { data, error } = await getUserSubscription(userId);
  
  if (error || !data) {
    return false;
  }
  
  return data.status === 'active' && new Date(data.expires_at) > new Date();
}; 