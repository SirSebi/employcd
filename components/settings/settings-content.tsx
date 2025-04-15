"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserHeader } from "@/components/user-header"
import { PasswordSettings } from "@/components/settings/password-settings"
import { CompanySettings } from "@/components/settings/company-settings"
import { useAuth } from "@/lib/auth-context"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("password")
  const [hasSubscription, setHasSubscription] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
  const { user, checkSubscription } = useAuth()

  useEffect(() => {
    const checkUserSubscription = async () => {
      const hasActive = await checkSubscription()
      setHasSubscription(hasActive)
      
      // Hier könnten wir in Zukunft auch die spezifische Plan-ID abrufen
      // Für jetzt simulieren wir, dass ein aktives Abonnement Plan 2 oder höher ist
      if (hasActive && user?.hasActiveSubscription) {
        setSubscriptionPlan("2") // Annahme: Stufe 2 oder höher für Unternehmenspersonalisierung
      }
    }

    checkUserSubscription()
  }, [checkSubscription, user])

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <UserHeader />
      
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Einstellungen</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="password">Passwort</TabsTrigger>
            <TabsTrigger value="company">Unternehmen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <Card>
              <CardContent className="pt-6">
                <PasswordSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardContent className="pt-6">
                <CompanySettings 
                  isPremium={subscriptionPlan === "2" || subscriptionPlan === "3"} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 