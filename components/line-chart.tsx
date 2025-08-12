"use client"

import { useEffect, useRef } from "react"

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
}

export function LineChart({ data }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const { width, height } = canvasRef.current
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Get dataset
    const dataset = data.datasets[0]
    const values = dataset.data

    // Calculate scales
    const maxValue = Math.max(...values, 1)
    const xScale = chartWidth / (values.length - 1)
    const yScale = chartHeight / maxValue

    // Draw axes
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = "#eee"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const y = height - padding.bottom - (i * chartHeight) / yTicks
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = "#888"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(Math.round((i * maxValue) / yTicks).toString(), padding.left - 5, y)
    }

    // Draw line
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.lineWidth = 2
    ctx.beginPath()

    values.forEach((value, index) => {
      const x = padding.left + index * xScale
      const y = height - padding.bottom - value * yScale

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    ctx.fillStyle = "hsl(var(--primary))"
    values.forEach((value, index) => {
      const x = padding.left + index * xScale
      const y = height - padding.bottom - value * yScale

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw x-axis labels
    ctx.fillStyle = "#888"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    // Only show a subset of labels to avoid overcrowding
    const labelStep = Math.ceil(data.labels.length / 10)
    data.labels.forEach((label, index) => {
      if (index % labelStep === 0 || index === data.labels.length - 1) {
        const x = padding.left + index * xScale
        ctx.fillText(label, x, height - padding.bottom + 5)
      }
    })
  }, [data])

  return <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
}

