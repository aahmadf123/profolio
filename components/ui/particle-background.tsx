"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameIdRef = useRef<number>()

  // Create particles
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Initialize particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const particleCount = Math.floor((dimensions.width * dimensions.height) / 15000)
    const newParticles: Particle[] = []

    const primaryColor = theme === "dark" ? "rgba(124, 58, 237, 0.5)" : "rgba(124, 58, 237, 0.2)"
    const secondaryColor = theme === "dark" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.2)"

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
      })
    }

    // Update the ref instead of state
    particlesRef.current = newParticles

    // Start the animation
    startAnimation()

    return () => {
      // Clean up animation on unmount or when dependencies change
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [dimensions, theme])

  // Animation function
  const startAnimation = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw particles
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.speedX *= -1
        }

        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      }

      // Draw connections
      ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    // Start the animation loop
    animationFrameIdRef.current = requestAnimationFrame(render)
  }

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none z-0" // Added pointer-events-none to ensure clicks pass through
    />
  )
}

