"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  id: string
  defaultValue: string
  className?: string
}

export function EditableText({ id, defaultValue, className }: EditableTextProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [text, setText] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Auto-focus and auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditMode && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [isEditMode])

  // Handle textarea resize on input
  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  if (isEditMode) {
    return (
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={handleTextareaInput}
        className={cn("min-h-[2em] resize-none", className)}
        placeholder="Enter text here..."
      />
    )
  }

  return <p className={className}>{text}</p>
}

