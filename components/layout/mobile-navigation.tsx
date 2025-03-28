"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/use-auth"

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  setIsSearchOpen: (open: boolean) => void
}

export function MobileNavigation({ isOpen, onClose, setIsSearchOpen }: MobileNavigationProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Blog", href: "/blog" },
    { name: "Resume", href: "/resume" },
    { name: "Contact", href: "/#contact" },
  ]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".mobile-menu") && !target.closest("button")) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mobile-menu fixed right-0 top-0 h-full w-3/4 max-w-xs bg-background shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "block px-4 py-2 rounded-md transition-colors",
                        pathname === item.href || (pathname === "/" && item.href.startsWith("/#"))
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}

                {/* Admin link (if authenticated) */}
                {isAuthenticated && (
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  >
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className={cn(
                        "block px-4 py-2 rounded-md transition-colors",
                        pathname.startsWith("/admin")
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      Admin
                    </Link>
                  </motion.li>
                )}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setIsSearchOpen(true)
                  onClose()
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

