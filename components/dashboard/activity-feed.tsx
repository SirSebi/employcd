"use client"

import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { 
  BadgeCheck, 
  User, 
  Plus, 
  Pencil, 
  Trash, 
  FileText, 
  Download,
  Settings
} from "lucide-react"

interface ActivityFeedProps {
  limit?: number
  showDetails?: boolean
}

type ActivityType = 
  | "create_employee"
  | "edit_employee"
  | "delete_employee"
  | "create_card"
  | "download_card"
  | "update_settings"
  | "create_template"

interface Activity {
  id: string
  type: ActivityType
  details: string
  metadata?: Record<string, any>
  timestamp: Date
}

export function ActivityFeed({ limit = 10, showDetails = false }: ActivityFeedProps) {
  // Simulierte Aktivitätsdaten
  const activities: Activity[] = [
    {
      id: "1",
      type: "create_employee",
      details: "Neuer Mitarbeiter: Anna Musterfrau",
      metadata: { employeeId: "emp-123", department: "Marketing" },
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 Minuten her
    },
    {
      id: "2",
      type: "create_card",
      details: "Ausweis erstellt für Max Mustermann",
      metadata: { employeeId: "emp-124", cardId: "card-456" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 Stunden her
    },
    {
      id: "3",
      type: "download_card",
      details: "Ausweis heruntergeladen: Lena Schmidt",
      metadata: { cardId: "card-789", format: "pdf" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 Stunden her
    },
    {
      id: "4",
      type: "edit_employee",
      details: "Mitarbeiterdaten aktualisiert: Martin Meyer",
      metadata: { employeeId: "emp-125", fields: ["position", "department"] },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 Tag her
    },
    {
      id: "5",
      type: "update_settings",
      details: "Unternehmenseinstellungen aktualisiert",
      metadata: { fields: ["companyName", "primaryColor"] },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 Tage her
    },
    {
      id: "6",
      type: "create_template",
      details: "Neue Ausweisvorlage erstellt: Standard",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 Tage her
    },
    {
      id: "7",
      type: "delete_employee",
      details: "Mitarbeiter gelöscht: Thomas Wagner",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 Tage her
    }
  ]
  
  // Limitiere die Aktivitäten entsprechend dem Limit
  const limitedActivities = activities.slice(0, limit)
  
  // Bestimme das Icon basierend auf dem Aktivitätstyp
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "create_employee":
        return <User className="h-4 w-4" />
      case "edit_employee":
        return <Pencil className="h-4 w-4" />
      case "delete_employee":
        return <Trash className="h-4 w-4" />
      case "create_card":
        return <BadgeCheck className="h-4 w-4" />
      case "download_card":
        return <Download className="h-4 w-4" />
      case "update_settings":
        return <Settings className="h-4 w-4" />
      case "create_template":
        return <FileText className="h-4 w-4" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }
  
  // Bestimme die Hintergrundfarbe basierend auf dem Aktivitätstyp
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "create_employee":
      case "create_card":
      case "create_template":
        return "bg-green-100 text-green-700"
      case "edit_employee":
      case "update_settings":
        return "bg-blue-100 text-blue-700"
      case "delete_employee":
        return "bg-red-100 text-red-700"
      case "download_card":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }
  
  return (
    <div className="space-y-4">
      {limitedActivities.length > 0 ? (
        <div className="space-y-3">
          {limitedActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`rounded-full p-1.5 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {activity.details}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: de })}
                </p>
                
                {showDetails && activity.metadata && (
                  <div className="mt-1 text-xs bg-muted/40 rounded-md p-2">
                    <pre className="font-mono overflow-x-auto whitespace-pre-wrap break-all">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Keine Aktivitäten gefunden.
        </p>
      )}
    </div>
  )
} 