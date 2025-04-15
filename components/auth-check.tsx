'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wenn die Authentifizierungsprüfung abgeschlossen ist (nicht mehr lädt)
    if (!isLoading) {
      // Wenn der Benutzer nicht authentifiziert ist und nicht bereits auf der Login-Seite ist
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }
      // Wenn der Benutzer authentifiziert ist und auf der Login-Seite ist
      else if (isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Wenn noch geladen wird, zeige nichts an
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Wenn auf der Login-Seite oder authentifiziert, zeige die Kinder-Komponenten an
  if (pathname === '/login' || isAuthenticated) {
    return <>{children}</>;
  }

  // Andernfalls zeige nichts an (während der Umleitung zur Login-Seite)
  return null;
} 