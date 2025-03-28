"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([])

  useEffect(() => {
    setMounted(true)
    // Only enable custom cursor on desktop
    if (window.innerWidth < 768) return

    const addTrailPoint = (x: number, y: number) => {
      const now = Date.now()
      setTrails((prev) => [...prev, { x, y, id: now }])

      // Remove trail after animation
      setTimeout(() => {
        setTrails((prev) => prev.filter((point) => point.id !== now))
      }, 500)
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)

      // Add trail point every few movements
      if (Math.random() > 0.8) {
        addTrailPoint(e.clientX, e.clientY)
      }
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    const handleLinkHoverStart = (e: MouseEvent) => {
      // Check if target is a link or button
      const target = e.target as HTMLElement
      const isLink =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.role === "button" ||
        target.classList.contains("cursor-pointer")

      if (isLink) {
        setLinkHovered(true)
      }
    }

    const handleLinkHoverEnd = () => {
      setLinkHovered(false)
    }

    const handleMouseLeave = () => {
      setHidden(true)
    }

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleLinkHoverStart)
    document.addEventListener("mouseout", handleLinkHoverEnd)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleLinkHoverStart)
      document.removeEventListener("mouseout", handleLinkHoverEnd)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Don't render anything on server side or before mounting
  if (!mounted) return null

  return (
    <>
      <div
        className={`custom-cursor ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${clicked ? 0.8 : linkHovered ? 1.5 : 1})`,
          mixBlendMode: "difference",
        }}
      >
        <div className="cursor-dot" />
        <div
          className="cursor-outline"
          style={{
            transform: `translate(-50%, -50%) scale(${linkHovered ? 1.5 : 1})`,
            opacity: linkHovered ? 0.8 : 0.5,
            borderColor: linkHovered ? "hsl(var(--primary))" : "hsl(var(--primary))",
          }}
        />
      </div>

      {/* Cursor trails */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: 0,
            animation: "fadeIn 0.1s forwards, fadeOut 0.4s 0.1s forwards",
          }}
        />
      ))}
    </>
  )
}

