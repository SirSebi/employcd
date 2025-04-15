"use client"

import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

export function SubscriptionStatus() {
  const { user, checkSubscription } = useAuth();
  
  if (!user) return null;
  
  const handleCheckSubscription = async () => {
    try {
      await checkSubscription();
    } catch (error) {
      console.error("Fehler beim Prüfen des Abonnements:", error);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleCheckSubscription}>
            <Badge variant={user.hasActiveSubscription ? "default" : "destructive"}>
              {user.hasActiveSubscription ? "Aktives Abonnement" : "Kein aktives Abonnement"}
            </Badge>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 max-w-xs">
            <p>
              {user.hasActiveSubscription 
                ? "Ihr Abonnement ist aktiv. Sie haben Zugriff auf alle Funktionen." 
                : "Ihr Abonnement ist inaktiv oder abgelaufen. Einige Funktionen könnten eingeschränkt sein."}
            </p>
            <p className="text-xs text-muted-foreground">(Klicken Sie, um den Abonnementstatus zu aktualisieren)</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 