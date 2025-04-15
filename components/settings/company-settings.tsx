"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, Check } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface CompanySettingsProps {
  isPremium: boolean
}

export function CompanySettings({ isPremium }: CompanySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Datei-Typ-Überprüfung
    if (!file.type.match('image/(jpeg|jpg|png|svg)')) {
      toast.error("Nur Bilddateien (JPG, PNG, SVG) sind erlaubt.")
      return
    }

    // Größenbeschränkung (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Das Bild darf maximal 2 MB groß sein.")
      return
    }

    setLogoFile(file)
    
    // Vorschau erstellen
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      // Hier würde die API-Anfrage zum Speichern der Unternehmenseinstellungen erfolgen
      // await saveCompanySettings(formData, logoFile)
      
      // Temporär simulieren wir eine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Unternehmenseinstellungen erfolgreich gespeichert.")
    } catch (error) {
      console.error("Fehler beim Speichern der Unternehmenseinstellungen:", error)
      toast.error("Einstellungen konnten nicht gespeichert werden. Bitte versuchen Sie es später erneut.")
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Premium-Funktion</AlertTitle>
          <AlertDescription>
            Die Anpassung des Unternehmensauftritts ist nur mit einem Premium-Abonnement (Stufe 2 oder höher) verfügbar.
            Bitte kontaktieren Sie uns, um Ihr Abonnement zu erweitern.
          </AlertDescription>
        </Alert>
        
        <div className="opacity-50 pointer-events-none">
          <form className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="companyName">Unternehmensname</Label>
              <Input id="companyName" disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primäre Unternehmensfarbe</Label>
              <div className="flex gap-2">
                <Input type="color" disabled />
                <Input type="text" disabled />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Sekundäre Unternehmensfarbe</Label>
              <div className="flex gap-2">
                <Input type="color" disabled />
                <Input type="text" disabled />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Unternehmenslogo</Label>
              <div className="border border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Datei hier ablegen oder auswählen</p>
              </div>
            </div>
            
            <Button disabled>Einstellungen speichern</Button>
          </form>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Unternehmenseinstellungen</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="companyName">Unternehmensname</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Meine Firma GmbH"
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Farben</h3>
          
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primäre Unternehmensfarbe</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primaryColorPicker"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                id="primaryColor"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Diese Farbe wird als Hauptfarbe für Buttons und Akzente verwendet.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Sekundäre Unternehmensfarbe</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="secondaryColorPicker"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                id="secondaryColor"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Diese Farbe wird als Akzentfarbe und für sekundäre Elemente verwendet.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="logo">Unternehmenslogo</Label>
          <div 
            className="border border-dashed rounded-lg p-6 text-center cursor-pointer"
            onClick={() => document.getElementById('logo')?.click()}
          >
            {logoPreview ? (
              <div className="flex flex-col items-center">
                <img 
                  src={logoPreview} 
                  alt="Logo Vorschau" 
                  className="max-h-32 max-w-full object-contain mb-2" 
                />
                <p className="text-sm text-muted-foreground">Klicken, um ein anderes Logo auszuwählen</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Datei hier ablegen oder auswählen</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  SVG, PNG oder JPG (max. 2MB)
                </p>
              </>
            )}
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/jpeg, image/png, image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="flex gap-2">
          {isLoading ? (
            <>Wird gespeichert...</>
          ) : (
            <>
              <Check className="h-4 w-4" /> Einstellungen speichern
            </>
          )}
        </Button>
      </form>
    </div>
  )
} 