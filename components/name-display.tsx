"use client"

import { useState, useEffect } from "react"
import { EditableText } from "@/components/editable-text"
import { cn } from "@/lib/utils"

interface NameDisplayProps {
  className?: string
}

export function NameDisplay({ className }: NameDisplayProps) {
  const [name, setName] = useState("Your Name")

  // Load name from environment variable if available
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      // Extract name from site URL or use default
      const siteName = process.env.NEXT_PUBLIC_SITE_URL.replace(/https?:\/\//, "")
        .split(".")[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      if (siteName && siteName.length > 0) {
        setName(siteName)
      }
    }
  }, [])

  return <EditableText id="user-name" defaultValue={name} className={cn("font-bold", className)} />
}

