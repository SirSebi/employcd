"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BadgeCheck, CalendarClock, Lock } from "lucide-react"
import { PremiumFeatureLock } from "@/components/premium-feature-lock"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export function StatisticsCards() {
  const { user, checkSubscription } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  
  useEffect(() => {
    const checkUserSubscription = async () => {
      const hasActive = await checkSubscription()
      // Annahme: Stufe 1 oder höher benötigt für Statistiken
      setIsPremium(hasActive)
    }
    
    checkUserSubscription()
  }, [checkSubscription])
  
  // Simulierte Statistikdaten
  const stats = {
    totalEmployees: 124,
    activeCards: 98,
    cardsCreatedThisMonth: 14,
    expiringNextMonth: 7
  }
  
  // Die eigentlichen Statistik-Karten
  const statisticsContent = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mitarbeiter gesamt</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Erfasste Mitarbeiter in der Datenbank
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktive Ausweise</CardTitle>
          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCards}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(stats.activeCards / stats.totalEmployees * 100)}% der Mitarbeiter
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Neue Ausweise (Monat)</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cardsCreatedThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Im aktuellen Monat erstellt
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ablaufende Ausweise</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiringNextMonth}</div>
          <p className="text-xs text-muted-foreground">
            Laufen im nächsten Monat ab
          </p>
        </CardContent>
      </Card>
    </div>
  )
  
  return (
    <PremiumFeatureLock 
      isUnlocked={isPremium}
      requiredTier={1}
      lockTitle="Statistiken - Premium-Funktion"
      lockMessage="Die detaillierten Statistiken sind nur mit einem aktiven Abonnement verfügbar."
    >
      {statisticsContent}
    </PremiumFeatureLock>
  )
} 