"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MainNavigation } from "./main-navigation"
import { MobileNavigation } from "./mobile-navigation"
import { Footer } from "./footer"
import { ParticleBackground } from "../ui/particle-background"
import { WaveBackground } from "../ui/wave-background"
import { AchievementNotification } from "../gamification/achievement-notification"
import { ChatbotWidget } from "../chatbot/chatbot-widget"
import { useAchievements } from "@/lib/use-achievements"
import { AuthProvider } from "@/components/auth-provider"
import { SearchDialog } from "@/components/search/search-dialog"
import { AdminLoginButton } from "@/components/admin/admin-login-button"
import { SafeSearchParams } from "@/components/safe-search-params"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { achievements, currentAchievement, dismissAchievement } = useAchievements()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col bg-background">
        {/* Background effects */}
        <ParticleBackground />
        <WaveBackground />

        {/* Main navigation */}
        <header className="relative z-40">
          <SafeSearchParams>
            <MainNavigation
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
          </SafeSearchParams>
          <MobileNavigation
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            setIsSearchOpen={setIsSearchOpen}
          />
        </header>

        {/* Main content */}
        <main className="flex-grow relative z-10">{children}</main>

        {/* Footer */}
        <Footer className="relative z-10" />

        {/* Achievement notification */}
        {currentAchievement && (
          <AchievementNotification achievement={currentAchievement} onDismiss={dismissAchievement} />
        )}

        {/* Chatbot Widget - now with dark class */}
        <div className="dark">
          <ChatbotWidget />
        </div>

        {/* Search Dialog */}
        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

        {/* Admin Login Button */}
        <AdminLoginButton />
      </div>
    </AuthProvider>
  )
}

