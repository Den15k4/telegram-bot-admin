// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { initDatabase } from "@/lib/db-init"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bot Admin Panel",
  description: "Administration panel for Telegram bot",
}

// Инициализируем базу данных при старте
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
