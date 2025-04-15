import { Sidebar } from "@/components/sidebar"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <SettingsContent />
    </div>
  )
} 