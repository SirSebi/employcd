import { BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Spezifische Abmessungen für den Ausweis
const CARD_WIDTH_PX = 2415;
const CARD_HEIGHT_PX = 1544;
const ASPECT_RATIO = CARD_WIDTH_PX / CARD_HEIGHT_PX; // ~1.564:1

// Typdefinition für die Abteilungen
type Department = 'it' | 'hr' | 'finance' | 'marketing' | 'operations' | string;

// Typdefinition für die CardData
interface CardData {
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: Department;
  employeeId?: string;
  issueDate?: Date;
  expiryDate?: Date;
  photo?: string;
}

// Typdefinition für die Komponente
interface IdCardPreviewProps {
  data: CardData;
  large?: boolean;
}

export function IdCardPreview({ data, large = false }: IdCardPreviewProps) {
  const { firstName, lastName, position, department, employeeId, issueDate, expiryDate, photo } = data

  const departmentNames: Record<string, string> = {
    it: "IT",
    hr: "Personalwesen",
    finance: "Finanzen",
    marketing: "Marketing",
    operations: "Betrieb",
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-muted-foreground mb-2">
        Ausweis-Format: {CARD_WIDTH_PX} x {CARD_HEIGHT_PX} Pixel
      </div>
      <div 
        className={cn(
          "relative", 
          large ? "w-full max-w-3xl" : "w-full max-w-md",
          "transition-all duration-300"
        )}
        style={{ 
          aspectRatio: `${ASPECT_RATIO}`, // Exaktes Seitenverhältnis erzwingen
        }}
      >
        <Card className="absolute inset-0 overflow-hidden">
          <div className="bg-primary h-[6%] flex items-center justify-between px-6">
            <div className="flex items-center">
              <BadgeCheck className="h-5 w-5 text-primary-foreground" />
              <h3 className="text-base font-bold text-primary-foreground ml-2">EMPLOYCD</h3>
            </div>
            <div className="text-xs text-primary-foreground font-medium">Mitarbeiterausweis</div>
          </div>
          <CardContent className="p-5 h-[94%] flex flex-col">
            <div className="flex gap-5 flex-grow">
              <div className="w-1/4 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo || "/placeholder.svg"} alt="Mitarbeiterfoto" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-center text-muted-foreground">Kein Foto</div>
                )}
              </div>
              <div className="flex-1 flex">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {firstName || "Vorname"} {lastName || "Nachname"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{position || "Position"}</p>
                  <p className="text-sm mt-1">{department && departmentNames[department] ? departmentNames[department] : "Abteilung"}</p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{employeeId || "EMP-00000"}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Ausgestellt:</span>
                    <span>{issueDate ? format(issueDate, "dd.MM.yyyy", { locale: de }) : "01.01.2023"}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Gültig bis:</span>
                    <span>{expiryDate ? format(expiryDate, "dd.MM.yyyy", { locale: de }) : "01.01.2025"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t text-center">
              <div className="text-xs text-muted-foreground">
                Dieser Ausweis ist Eigentum des Unternehmens und muss bei Beendigung des Arbeitsverhältnisses zurückgegeben werden.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Das exakte Maßverhältnis eines Ausweises (2415:1544)
      </div>
    </div>
  )
}
