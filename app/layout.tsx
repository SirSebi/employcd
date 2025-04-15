import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { AuthCheck } from '@/components/auth-check'

export const metadata: Metadata = {
  title: 'EmployCD',
  description: 'EmployCD - Ausweisgenerator',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <AuthCheck>
            {children}
          </AuthCheck>
        </AuthProvider>
      </body>
    </html>
  )
}
