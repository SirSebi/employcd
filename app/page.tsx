import { redirect } from "next/navigation"

export default function Home() {
  // Leite zur Dashboard-Seite weiter
  redirect('/dashboard')
}
