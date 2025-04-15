"use client"

import { useState } from "react"
import { UserHeader } from "@/components/user-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RecentEmployeeCards } from "@/components/dashboard/recent-employee-cards"
import { StatisticsCards } from "@/components/dashboard/statistics-cards"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { PlusCircle, Download, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <UserHeader />
      
      <div className="p-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Willkommen zurück! Hier ist ein Überblick über Ihre Aktivitäten.</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => router.push("/employees")}
            >
              Alle Mitarbeiter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              onClick={() => router.push("/create")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Neuer Ausweis
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="recent">Letzte Aktivitäten</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <StatisticsCards />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Neueste Ausweise</CardTitle>
                  <CardDescription>Zuletzt erstellte Mitarbeiterausweise</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentEmployeeCards limit={5} />
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Aktivitäten</CardTitle>
                  <CardDescription>Ihre letzten Aktionen im System</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed limit={5} />
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2"
                    onClick={() => setActiveTab("recent")}
                  >
                    Alle Aktivitäten anzeigen
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Schnellzugriff</CardTitle>
                <CardDescription>Häufig verwendete Aktionen</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => router.push("/create")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Neuer Ausweis erstellen
                </Button>
                <Button variant="outline" onClick={() => router.push("/templates")}>
                  Ausweisvorlagen verwalten
                </Button>
                <Button variant="outline" onClick={() => router.push("/employees")}>
                  Mitarbeiterliste anzeigen
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Berichte exportieren
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Detaillierte Aktivitätsübersicht</CardTitle>
                <CardDescription>Alle Aktivitäten in chronologischer Reihenfolge</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed limit={20} showDetails />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 