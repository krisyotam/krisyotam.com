"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface RevenuePoint {
  month: string
  value: number
}

interface CompanyCardProps {
  name: string
  description: string
  logo: string
  monthlyRevenue: number
  revenueHistory: RevenuePoint[]
  minValue: number
  maxValue: number
}

export function CompanyCard({
  name,
  description,
  logo,
  monthlyRevenue,
  revenueHistory,
  minValue,
  maxValue,
}: CompanyCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`
    }
    return `$${amount}`
  }

  // Draw the revenue chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw the chart
    if (revenueHistory.length === 0) return

    const padding = { top: 5, right: 5, bottom: 5, left: 5 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Calculate the range
    const valueRange = maxValue - minValue

    // Draw the path
    ctx.beginPath()
    ctx.moveTo(
      padding.left,
      chartHeight + padding.top - ((revenueHistory[0].value - minValue) / valueRange) * chartHeight,
    )

    revenueHistory.forEach((point, index) => {
      const x = padding.left + (index / (revenueHistory.length - 1)) * chartWidth
      const y = chartHeight + padding.top - ((point.value - minValue) / valueRange) * chartHeight
      ctx.lineTo(x, y)
    })

    // Style the line
    ctx.strokeStyle = "#FFC107"
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill the area under the curve
    ctx.lineTo(padding.left + chartWidth, chartHeight + padding.top)
    ctx.lineTo(padding.left, chartHeight + padding.top)
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight)
    gradient.addColorStop(0, "rgba(255, 193, 7, 0.2)")
    gradient.addColorStop(1, "rgba(255, 193, 7, 0.0)")
    ctx.fillStyle = gradient
    ctx.fill()
  }, [revenueHistory, minValue, maxValue])

  return (
    <Card className="overflow-hidden">
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 relative flex-shrink-0">
              <Image
                src={logo || "/placeholder.svg"}
                alt={`${name} logo`}
                width={28}
                height={28}
                className="rounded-md object-cover"
                style={{ width: "28px", height: "28px" }} // Ensure square dimensions
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{name}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-medium">
            ${(monthlyRevenue / 1000).toFixed(monthlyRevenue < 1000 ? 0 : 1)}k/mo
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
            <span>{formatCurrency(maxValue)}</span>
          </div>
          <div className="h-[70px] w-full relative">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>{formatCurrency(minValue)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            {revenueHistory.map((point, index) => index % 2 === 0 && <span key={index}>{point.month}</span>)}
          </div>
        </div>
      </div>
    </Card>
  )
}

