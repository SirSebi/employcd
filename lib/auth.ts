import { jwtDecode } from 'jwt-decode';
import { 
  signInUser, 
  signOutUser, 
  getCurrentUser, 
  hasActiveSubscription 
} from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  hasActiveSubscription?: boolean;
}

interface AuthToken {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

// Speichere Token sicher in Electron
export const saveToken = (token: string, refreshToken?: string): void => {
  if (typeof window !== 'undefined' && window.electron) {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const expiresAt = decodedToken.exp * 1000; // Umwandlung in Millisekunden
    
    const authToken: AuthToken = {
      token,
      expiresAt,
      refreshToken
    };
    
    // Verwendet den Electron-Kontext, um Token sicher zu speichern
    window.electron.secureStorage.set('auth_token', JSON.stringify(authToken));
  } else {
    console.error('Electron-Kontext nicht verfügbar');
  }
};

// Hole Token aus sicherem Speicher
export const getToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && window.electron) {
    try {
      const authTokenStr = await window.electron.secureStorage.get('auth_token');
      if (!authTokenStr) return null;
      
      const authToken: AuthToken = JSON.parse(authTokenStr);
      
      // Prüfen, ob Token abgelaufen ist
      if (Date.now() >= authToken.expiresAt) {
        removeToken();
        return null;
      }
      
      return authToken.token;
    } catch (error) {
      console.error('Fehler beim Abrufen des Tokens:', error);
      return null;
    }
  }
  return null;
};

// Entferne Token (für Logout)
export const removeToken = (): void => {
  if (typeof window !== 'undefined' && window.electron) {
    window.electron.secureStorage.delete('auth_token');
  }
};

// Dekodiere Token, um Benutzerinformationen zu erhalten
export const getUser = async (): Promise<User | null> => {
  const token = await getToken();
  if (!token) return null;
  
  try {
    // Benutze Supabase, um aktuelle Benutzerinformationen zu erhalten
    const { data, error } = await getCurrentUser();
    
    if (error || !data.user) {
      throw error || new Error('Keine Benutzerinformationen gefunden');
    }
    
    const user = data.user;
    
    // Prüfe, ob der Benutzer ein aktives Abonnement hat
    const isSubscriptionActive = await hasActiveSubscription(user.id);
    
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Benutzer',
      email: user.email || '',
      role: user.user_metadata?.role || 'user',
      hasActiveSubscription: isSubscriptionActive
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
    removeToken(); // Bei Fehler Token entfernen und Benutzer ausloggen
    return null;
  }
};

// API-Funktion zur Anmeldung mit Supabase
export const loginUser = async (email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const { data, error } = await signInUser(email, password);
    
    if (error || !data.session) {
      throw error || new Error('Anmeldung fehlgeschlagen: Keine Sitzungsdaten erhalten');
    }
    
    const token = data.session.access_token;
    const refreshToken = data.session.refresh_token;
    
    // Sicheres Speichern von Token und Refresh Token
    saveToken(token, refreshToken);
    
    // Prüfe, ob der Benutzer ein aktives Abonnement hat
    const isSubscriptionActive = await hasActiveSubscription(data.user.id);
    
    return {
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split('@')[0],
        email: data.user.email || email,
        role: data.user.user_metadata?.role || 'user',
        hasActiveSubscription: isSubscriptionActive
      },
      token: token
    };
  } catch (error) {
    console.error('Fehler bei der Anmeldung:', error);
    return null;
  }
};

// Abmeldefunktion mit Supabase
export const logoutUser = async (): Promise<void> => {
  try {
    // Zuerst lokales Token entfernen
    removeToken();
    
    // Dann Supabase-Abmeldung
    await signOutUser();
  } catch (error) {
    console.error('Fehler bei der Abmeldung:', error);
  }
};

// Prüfe, ob Benutzer angemeldet ist
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
}; 