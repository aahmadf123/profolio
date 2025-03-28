"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Wave properties
    const waves = [
      {
        y: 0.5,
        length: 0.01,
        amplitude: 20,
        speed: 0.01,
        color: theme === "dark" ? "rgba(59, 178, 241, 0.05)" : "rgba(124, 58, 237, 0.03)",
      },
      {
        y: 0.6,
        length: 0.02,
        amplitude: 15,
        speed: 0.007,
        color: theme === "dark" ? "rgba(0, 173, 181, 0.05)" : "rgba(16, 185, 129, 0.03)",
      },
      {
        y: 0.4,
        length: 0.015,
        amplitude: 25,
        speed: 0.005,
        color: theme === "dark" ? "rgba(59, 178, 241, 0.05)" : "rgba(124, 58, 237, 0.03)",
      },
    ]

    let animationFrame: number
    let time = 0

    // Animation loop
    const animate = () => {
      time += 0.05
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each wave
      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()

        // Start at the left edge
        ctx.moveTo(0, canvas.height * wave.y)

        // Draw the wave
        for (let x = 0; x < canvas.width; x++) {
          const dx = x * wave.length
          const y = Math.sin(dx + time * wave.speed) * wave.amplitude + canvas.height * wave.y
          ctx.lineTo(x, y)
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70 dark:opacity-40" />
}

