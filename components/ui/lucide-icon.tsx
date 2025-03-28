"use client"

import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

interface LucideIconProps {
  name: keyof typeof LucideIcons
  className?: string
  size?: number
}

export function LucideIcon({ name, className, size = 24 }: LucideIconProps) {
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle

  return <Icon className={cn(className)} size={size} />
}

