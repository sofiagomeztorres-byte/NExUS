import type { Metadata, Viewport } from 'next'
import './globals.css'
import { NexusProvider } from '@/lib/context'
import { ThemeInitializer } from '@/components/ThemeInitializer'
import { ToastContainer } from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'NExUS | Premium Operations Center',
  description: 'Multi-brand operations dashboard for entrepreneurs and creators',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-nexus-white max-w-[430px] mx-auto">
        <ThemeInitializer />
        <ToastContainer />
        <NexusProvider>
          {children}
        </NexusProvider>
      </body>
    </html>
  )
}
