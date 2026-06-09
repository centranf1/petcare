import './globals.css'
import React from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Klinik Hewan App',
  description: 'Manajemen klinik hewan untuk pelanggan, dokter, dan admin.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
