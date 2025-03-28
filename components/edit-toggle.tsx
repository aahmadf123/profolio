"use client"

import { useState, useEffect } from "react"
import { Pencil, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function EditToggle() {
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && isEditMode) {
      setIsEditMode(false)
      toast({
        title: "Authentication required",
        description: "Please log in to edit content",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, isEditMode, toast])

  const toggleEditMode = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (isEditMode) {
      // Save changes when exiting edit mode
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
    }

    setIsEditMode(!isEditMode)

    // Dispatch custom event to notify editable components
    window.dispatchEvent(
      new CustomEvent("editmode", {
        detail: { isEditMode: !isEditMode },
      }),
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleEditMode} className="flex items-center gap-1">
      {isEditMode ? (
        <>
          <Save className="h-4 w-4" />
          <span>Save</span>
        </>
      ) : (
        <>
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </>
      )}
    </Button>
  )
}

