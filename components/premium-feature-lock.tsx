"use client"

import { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PremiumFeatureLockProps {
  /**
   * Ist die Funktion für den Nutzer verfügbar?
   */
  isUnlocked: boolean
  
  /**
   * Welche Abostufe wird mindestens benötigt?
   */
  requiredTier?: number
  
  /**
   * Benutzerdefinierter Titel für die Sperrbenachrichtigung
   */
  lockTitle?: string
  
  /**
   * Benutzerdefinierte Nachricht für die Sperrbenachrichtigung
   */
  lockMessage?: string
  
  /**
   * Soll die gesperrte Komponente angezeigt werden (abgeblendet)?
   */
  showLockedPreview?: boolean
  
  /**
   * Die Komponente, die nur bei entsprechendem Abo angezeigt werden soll
   */
  children: ReactNode
}

export function PremiumFeatureLock({
  isUnlocked,
  requiredTier = 1,
  lockTitle = "Premium-Funktion",
  lockMessage,
  showLockedPreview = true,
  children
}: PremiumFeatureLockProps) {
  // Standardnachricht, wenn keine benutzerdefinierte Nachricht angegeben wurde
  const defaultMessage = requiredTier === 1
    ? "Diese Funktion erfordert ein aktives Abonnement. Bitte kontaktieren Sie uns, um ein Abonnement abzuschließen."
    : `Diese Funktion ist nur mit einem Premium-Abonnement (Stufe ${requiredTier} oder höher) verfügbar. Bitte kontaktieren Sie uns, um Ihr Abonnement zu erweitern.`
  
  const message = lockMessage || defaultMessage
  
  // Wenn die Funktion entsperrt ist, zeigen wir den Inhalt normal an
  if (isUnlocked) {
    return <>{children}</>
  }
  
  // Wenn die Funktion gesperrt ist
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{lockTitle}</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
      
      {showLockedPreview && (
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  )
} 