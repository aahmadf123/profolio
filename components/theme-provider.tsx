'use client'

import type React from 'react'

import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '@/lib/use-local-storage'
import { useAchievements } from '@/lib/use-achievements'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = 'system', ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>('ui-theme', defaultTheme)
  const { unlockAchievement } = useAchievements()
  const [hasMounted, setHasMounted] = useState(false)
  const [hasUnlockedAchievement, setHasUnlockedAchievement] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>('')

  // Only run once after initial mount to set hasMounted flag
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Apply theme to document and handle achievements
  useEffect(() => {
    if (!hasMounted) return

    const root = window.document.documentElement

    // Add transition class for smooth theme changes
    root.classList.add('transition-colors', 'duration-300')

    let effectiveTheme = theme
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Set data attribute for CSS transitions
    root.setAttribute('data-theme', effectiveTheme)

    // Small delay before changing classes to allow for transition
    setTimeout(() => {
      root.classList.remove('light', 'dark')
      root.classList.add(effectiveTheme)
      setCurrentTheme(effectiveTheme)
    }, 50)

    // Only unlock achievement once per session and only after initial mount
    if (!hasUnlockedAchievement) {
      if (effectiveTheme === 'dark') {
        unlockAchievement('night_owl')
      } else {
        unlockAchievement('early_bird')
      }
      setHasUnlockedAchievement(true)
    }
  }, [theme, hasMounted, hasUnlockedAchievement, unlockAchievement])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const root = window.document.documentElement
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'

      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
      setCurrentTheme(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
