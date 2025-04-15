import { Sidebar } from "@/components/sidebar"
import { EmployeesContent } from "@/components/employees/employees-content"

export default function EmployeesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <EmployeesContent />
    </div>
  )
} 