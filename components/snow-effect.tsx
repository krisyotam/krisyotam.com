"use client"

import { useEffect, useRef } from "react"

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      radius: number
      speed: number
      wind: number
    }> = []

    const particleCount = 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
      })
    }

    function draw() {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = document.documentElement.classList.contains("dark") ? "#A0A0A0" : "#FFFFFF"

        particles.forEach((particle) => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fill()

          particle.y += particle.speed
          particle.x += particle.wind

          if (particle.y > canvas.height) {
            particle.y = -5
            particle.x = Math.random() * canvas.width
          }
          if (particle.x > canvas.width) {
            particle.x = 0
          }
          if (particle.x < 0) {
            particle.x = canvas.width
          }
        })

        requestAnimationFrame(draw)
      }
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    const observer = new MutationObserver(() => {
      ctx.fillStyle = document.documentElement.classList.contains("dark") ? "#A0A0A0" : "#FFFFFF"
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

