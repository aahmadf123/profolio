"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function EditableProjects() {
  const [isEditMode, setIsEditMode] = useState(false)

  // Listen for edit mode changes
  useEffect(() => {
    const handleEditModeChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setIsEditMode(customEvent.detail.isEditMode)
    }

    window.addEventListener("editmode", handleEditModeChange as EventListener)

    return () => {
      window.removeEventListener("editmode", handleEditModeChange as EventListener)
    }
  }, [])

  if (!isEditMode) {
    return null
  }

  return (
    <div className="mt-12 text-center">
      <Button variant="outline" className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Project
      </Button>
      <p className="text-xs text-muted-foreground mt-2">Only visible in edit mode</p>
    </div>
  )
}

