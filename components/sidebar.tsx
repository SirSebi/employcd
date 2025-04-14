"use client"

import { useState } from "react"
import { BadgeCheck, Settings, Users, PlusCircle, Database, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  const [active, setActive] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "create", icon: PlusCircle, label: "Neuer Ausweis" },
    { id: "employees", icon: Users, label: "Mitarbeiter" },
    { id: "templates", icon: BadgeCheck, label: "Vorlagen" },
    { id: "database", icon: Database, label: "Datenbank" },
    { id: "settings", icon: Settings, label: "Einstellungen" },
  ]

  return (
    <div className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-center p-2">
          <div className="bg-primary rounded-lg p-2 text-primary-foreground">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold ml-2">EMPLOYCD</h1>
        </div>
      </div>
      <Separator />
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={active === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-normal mb-1",
                active === item.id ? "bg-secondary" : "",
              )}
              onClick={() => setActive(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </div>
    </div>
  )
}
