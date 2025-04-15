import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { AuthCheck } from '@/components/auth-check'
import { Toaster } from '@/components/ui/toaster'

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
    <html lang="de" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <AuthCheck>
            {children}
          </AuthCheck>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
