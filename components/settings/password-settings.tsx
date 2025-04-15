"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function PasswordSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Überprüfung, ob die Passwörter übereinstimmen
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Die neuen Passwörter stimmen nicht überein.")
      return
    }
    
    // Überprüfung der Mindestanforderungen an das Passwort
    if (formData.newPassword.length < 8) {
      toast.error("Das neue Passwort muss mindestens 8 Zeichen lang sein.")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Hier würde die API-Anfrage zum Ändern des Passworts erfolgen
      // await changePassword(formData.currentPassword, formData.newPassword)
      
      // Temporär simulieren wir eine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Passwort erfolgreich geändert.")
      
      // Formular zurücksetzen
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Fehler beim Ändern des Passworts:", error)
      toast.error("Passwort konnte nicht geändert werden. Bitte versuchen Sie es später erneut.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Passwort ändern</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">Neues Passwort</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted-foreground">
            Das Passwort muss mindestens 8 Zeichen lang sein.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Wird geändert..." : "Passwort ändern"}
        </Button>
      </form>
    </div>
  )
} 