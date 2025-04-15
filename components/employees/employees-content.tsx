"use client"

import { useState } from "react"
import { UserHeader } from "@/components/user-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmployeesContent() {
  const router = useRouter()
  
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <UserHeader />
      
      <div className="p-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mitarbeiter</h1>
            <p className="text-muted-foreground">Verwalten Sie alle Mitarbeiter und deren Ausweise.</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => router.push("/create")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Neuer Ausweis
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mitarbeiterübersicht</CardTitle>
            <CardDescription>Hier wird eine vollständige Liste aller Mitarbeiter angezeigt.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Die Mitarbeiterliste wird in Kürze implementiert...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 