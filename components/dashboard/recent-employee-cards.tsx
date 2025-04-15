"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"

interface RecentEmployeeCardsProps {
  limit?: number
}

export function RecentEmployeeCards({ limit = 5 }: RecentEmployeeCardsProps) {
  // Simulierte Daten für kürzlich erstellte Mitarbeiterausweise
  const recentCards = [
    {
      id: "1",
      employeeName: "Anna Musterfrau",
      department: "Marketing",
      position: "Senior Marketing Manager",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      photoUrl: null,
      status: "active" as const
    },
    {
      id: "2",
      employeeName: "Max Mustermann",
      department: "Entwicklung",
      position: "Softwareentwickler",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
      photoUrl: null,
      status: "active" as const
    },
    {
      id: "3",
      employeeName: "Lena Schmidt",
      department: "Vertrieb",
      position: "Account Manager",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      photoUrl: null,
      status: "active" as const
    },
    {
      id: "4",
      employeeName: "Martin Meyer",
      department: "Finanzen",
      position: "Buchhalter",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      photoUrl: null,
      status: "pending" as const
    },
    {
      id: "5",
      employeeName: "Julia Becker",
      department: "Personal",
      position: "HR Manager",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      photoUrl: null,
      status: "active" as const
    },
    {
      id: "6",
      employeeName: "Thomas Wagner",
      department: "IT",
      position: "Systemadministrator",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      photoUrl: null,
      status: "expired" as const
    }
  ]
  
  // Begrenzen der Anzahl entsprechend dem Limit
  const limitedCards = recentCards.slice(0, limit)
  
  // Status in deutsche Bezeichnungen und Farben umwandeln
  const statusMap = {
    active: { label: 'Aktiv', color: 'bg-green-500' },
    pending: { label: 'Ausstehend', color: 'bg-yellow-500' },
    expired: { label: 'Abgelaufen', color: 'bg-red-500' }
  }
  
  return (
    <div className="space-y-4">
      {limitedCards.length > 0 ? (
        <div className="space-y-3">
          {limitedCards.map((card) => {
            // Generiere die Initialien für den Avatar-Fallback
            const initials = card.employeeName
              .split(' ')
              .map(name => name.charAt(0))
              .join('')
              .toUpperCase()
            
            const status = statusMap[card.status]
            
            return (
              <div key={card.id} className="flex items-center space-x-4 rounded-md border p-3">
                <Avatar>
                  <AvatarImage src={card.photoUrl || undefined} alt={card.employeeName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{card.employeeName}</p>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${status.color} mr-1.5`} />
                      <span className="text-xs">{status.label}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {card.position} • {card.department}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Erstellt {formatDistanceToNow(card.createdAt, { addSuffix: true, locale: de })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Keine kürzlich erstellten Ausweise gefunden.
        </p>
      )}
    </div>
  )
} 