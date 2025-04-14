"use client"

import { BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { useState, useEffect } from "react"
import QRCode from "react-qr-code"

export function IdCardPreview({ data, large = false }) {
  const { firstName, lastName, position, department, employeeId, issueDate, expiryDate, photo } = data

  // UUID für den Ausweis generieren (einmal beim ersten Rendern)
  const [cardUuid, setCardUuid] = useState("")

  useEffect(() => {
    // Einfache UUID-Generierung
    const generateUUID = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    if (!cardUuid) {
      setCardUuid(generateUUID())
    }
  }, [cardUuid])

  const departmentNames = {
    it: "IT",
    hr: "Personalwesen",
    finance: "Finanzen",
    marketing: "Marketing",
    operations: "Betrieb",
  }

  // Aspect ratio of 2415:1544 (approximately 1.564:1)
  const aspectRatio = 2415 / 1544

  return (
    <div
      className="relative w-full max-w-[500px]"
      style={{
        aspectRatio: aspectRatio,
      }}
    >
      <Card className="absolute inset-0 overflow-hidden">
        <div className="bg-primary h-[12%] flex items-center justify-between px-6">
          <div className="flex items-center">
            <BadgeCheck className="h-7 w-7 text-primary-foreground" />
            <h3 className="text-xl font-bold text-primary-foreground ml-2">EMPLOYCD</h3>
          </div>
          <div className="text-sm text-primary-foreground font-medium">Mitarbeiterausweis</div>
        </div>
        <CardContent className="p-6 h-[88%] flex flex-col">
          {/* Hauptbereich mit Foto und Informationen */}
          <div className="flex gap-6 mb-4">
            {/* Foto-Container mit angepasstem Seitenverhältnis */}
            <div className="w-[20%] h-[110px] bg-muted rounded-md flex items-center justify-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo) || "/placeholder.svg"}
                  alt="Mitarbeiterfoto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm">Kein Foto</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">
                {firstName || "Vorname"} {lastName || "Nachname"}
              </h3>
              <p className="text-muted-foreground text-lg mb-2">{position || "Position"}</p>
              <p className="text-base font-medium">{departmentNames[department] || "Abteilung"}</p>
            </div>
          </div>

          {/* Mittlerer Bereich mit Details */}
          <div className="border-t pt-3 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-medium">{employeeId || "EMP-00000"}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Ausgestellt:</span>
                  <span>{issueDate ? format(issueDate, "dd.MM.yyyy", { locale: de }) : "01.01.2023"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gültig bis:</span>
                  <span>{expiryDate ? format(expiryDate, "dd.MM.yyyy", { locale: de }) : "01.01.2025"}</span>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <div className="bg-white p-1 rounded">
                  {cardUuid && <QRCode value={cardUuid} size={60} level="L" />}
                </div>
              </div>
            </div>
          </div>

          {/* UUID am unteren Rand */}
          <div className="mt-auto border-t pt-2 text-center">
            <div className="text-[9px] text-muted-foreground font-mono">{cardUuid || "xxxx-xxxx-xxxx-xxxx"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
