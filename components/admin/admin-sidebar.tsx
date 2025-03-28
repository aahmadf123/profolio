"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  Palette,
  Layers,
  Gamepad2,
  MessageSquare,
  History,
  Save,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  BookOpen,
  FileTextIcon,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FileText,
    },
    {
      label: "Blog",
      href: "/admin/blog",
      icon: BookOpen,
    },
    {
      label: "Resume",
      href: "/admin/resume",
      icon: FileTextIcon,
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: Image,
    },
    {
      label: "Skills",
      href: "/admin/skills",
      icon: Users,
    },
    {
      label: "Contact",
      href: "/admin/contact",
      icon: Mail,
    },
    {
      label: "Design",
      href: "/admin/design",
      icon: Palette,
    },
    {
      label: "Templates",
      href: "/admin/templates",
      icon: Layers,
    },
    {
      label: "Gamification",
      href: "/admin/gamification",
      icon: Gamepad2,
    },
    {
      label: "Chatbot",
      href: "/admin/chatbot",
      icon: MessageSquare,
    },
    {
      label: "Activity Logs",
      href: "/admin/logs",
      icon: History,
    },
    {
      label: "Backups",
      href: "/admin/backups",
      icon: Save,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={cn(
        "h-screen bg-muted/30 border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className={cn("h-16 border-b flex items-center px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/admin" className="font-bold text-xl">
            Admin
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse button for mobile */}
      <div className="md:hidden p-4 border-t">
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center" onClick={toggleSidebar}>
          <PanelLeft className="h-4 w-4 mr-2" />
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
    </div>
  )
}

