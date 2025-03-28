import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AutoLogger } from "@/components/auto-logger"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { KeyboardNavigation } from "@/components/keyboard-navigation"
import { Suspense } from "react"
import { EnvChecker } from "@/components/env-checker"
import { EnvProvider } from "./env-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Portfolio | Professional Web Developer",
  description:
    "A showcase of my work, skills, and experience as a web developer. Explore my projects, resume, and blog.",
  keywords: ["web developer", "portfolio", "frontend", "backend", "full-stack", "projects"],
  authors: [{ name: "Portfolio Owner", url: "https://yourportfolio.com" }],
  creator: "Portfolio Owner",
  publisher: "Portfolio Owner",
  openGraph: {
    title: "Personal Portfolio | Professional Web Developer",
    description: "A showcase of my work, skills, and experience as a web developer.",
    url: "https://yourportfolio.com",
    siteName: "Personal Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Portfolio | Professional Web Developer",
    description: "A showcase of my work, skills, and experience as a web developer.",
    creator: "@yourtwitter",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <EnvProvider />
        <ThemeProvider defaultTheme="system">
          <EnvChecker />
          {children}
          <Suspense fallback={null}>
            <AutoLogger />
          </Suspense>
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
          <Suspense fallback={null}>
            <KeyboardNavigation />
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}