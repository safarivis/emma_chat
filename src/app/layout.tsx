import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emma Chat',
  description: 'Chat with Emma AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
}
