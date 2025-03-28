"use client"

import { useEffect, useState } from "react"

interface Section {
  id: string
  label: string
}

export function KeyboardNavigation() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)

  // Define the main sections of your website
  const sections: Section[] = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ]

  useEffect(() => {
    if (typeof window === "undefined") return

    // Determine active section based on scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      // Find the current section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input, textarea, etc.
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      const currentIndex = activeSection ? sections.findIndex((section) => section.id === activeSection) : 0

      // Navigate with arrow keys or J/K
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % sections.length
        navigateToSection(sections[nextIndex].id)
        showNavigationHint()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length
        navigateToSection(sections[prevIndex].id)
        showNavigationHint()
      }
    }

    const navigateToSection = (sectionId: string) => {
      const section = document.getElementById(sectionId)
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
        setActiveSection(sectionId)
      }
    }

    const showNavigationHint = () => {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleKeyDown)

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeSection, sections])

  if (typeof window === "undefined") return null

  return (
    <>
      {showHint && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">
                ←
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">
                →
              </kbd>
            </div>
            <span className="text-sm">or</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">
                J
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">
                K
              </kbd>
            </div>
            <span className="text-sm">to navigate</span>
          </div>
        </div>
      )}
    </>
  )
}

