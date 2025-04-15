"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdCardForm } from "@/components/id-card-form"
import { IdCardPreview } from "@/components/id-card-preview"
import { Button } from "@/components/ui/button"
import { Download, Printer, Save } from "lucide-react"
import { UserHeader } from "@/components/user-header"

// Definiere einen Typ für die Formulardaten
interface FormData {
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  employeeId: string;
  issueDate: Date;
  expiryDate: Date;
  photo: File | null;
}

export function MainContent() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    position: "",
    department: "",
    employeeId: "",
    issueDate: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    photo: null,
  })

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }))
  }

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <UserHeader />
      
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Neuer Mitarbeiterausweis</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Drucken
            </Button>
            <Button variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportieren
            </Button>
          </div>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
            <TabsTrigger value="preview">Vorschau</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            {/* Nur das Formular anzeigen, keine geteilte Ansicht mehr */}
            <Card>
              <CardContent className="pt-6">
                <IdCardForm data={formData} onChange={handleFormChange} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6 flex items-center justify-center min-h-[500px]">
                <IdCardPreview data={formData} large />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
