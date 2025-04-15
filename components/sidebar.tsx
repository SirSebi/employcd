"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { BadgeCheck, Settings, Users, PlusCircle, Database, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  // Aktive Seite basierend auf dem Pfadnamen bestimmen
  const getActiveFromPath = (path: string) => {
    if (path === '/') return 'dashboard'
    if (path === '/settings') return 'settings'
    // Weitere Pfadzuordnungen können hier hinzugefügt werden
    return path.substring(1) // Entferne den führenden Slash
  }
  
  const [active, setActive] = useState(getActiveFromPath(pathname || '/'))

  // Bei Pfadänderungen den aktiven Status aktualisieren
  useEffect(() => {
    setActive(getActiveFromPath(pathname || '/'))
  }, [pathname])

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { id: "create", icon: PlusCircle, label: "Neuer Ausweis", path: "/create" },
    { id: "employees", icon: Users, label: "Mitarbeiter", path: "/employees" },
    { id: "templates", icon: BadgeCheck, label: "Vorlagen", path: "/templates" },
    { id: "database", icon: Database, label: "Datenbank", path: "/database" },
    { id: "settings", icon: Settings, label: "Einstellungen", path: "/settings" },
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActive(item.id)
    router.push(item.path)
  }

  const handleLogout = async () => {
    await logout()
    // Der Redirect wird automatisch durch den AuthCheck in app/layout.tsx gehandhabt
  }

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
              onClick={() => handleMenuClick(item)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </div>
    </div>
  )
}
