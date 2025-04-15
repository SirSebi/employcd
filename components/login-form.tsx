'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LockKeyhole, Mail, AlertTriangle } from 'lucide-react';

// Schema für die Validierung der Formularfelder
const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setErrorMessage(null);
    setShowSubscriptionWarning(false);
    
    const success = await login(data.email, data.password);
    
    if (success) {
      // Prüfen, ob der Benutzer ein aktives Abonnement hat
      if (user && !user.hasActiveSubscription) {
        setShowSubscriptionWarning(true);
        // Wir leiten trotzdem weiter, zeigen aber eine Warnung an
        setTimeout(() => {
          router.push('/');
        }, 3000); // 3 Sekunden warten, damit der Benutzer die Warnung sehen kann
      } else {
        // Weiterleitung zur Hauptseite nach erfolgreicher Anmeldung
        router.push('/');
      }
    } else {
      setErrorMessage('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Anmelden</CardTitle>
          <CardDescription className="text-center">
            Geben Sie Ihre Anmeldedaten ein, um auf EmployCD zuzugreifen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {showSubscriptionWarning && (
                <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Achtung: Sie haben kein aktives Abonnement. Einige Funktionen könnten eingeschränkt sein.
                    Sie werden in Kürze weitergeleitet.
                  </AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="name@firma.de" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground">
            Bei Problemen wenden Sie sich bitte an Ihren Administrator.
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            Für die Nutzung ist ein gültiges Abonnement erforderlich.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 