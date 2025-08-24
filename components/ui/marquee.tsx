"use client"

import type React from "react"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  // Define the CSS for animations directly in the component
  const marqueeStyles = `
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-100% - 1rem)); }
    }
    
    @keyframes marqueeVertical {
      from { transform: translateY(0); }
      to { transform: translateY(calc(-100% - 1rem)); }
    }
    
    .marquee-container {
      display: flex;
      overflow: hidden;
      padding: 0.5rem;
      gap: 1rem;
    }
    
    .marquee-vertical {
      flex-direction: column;
    }
    
    .marquee-horizontal {
      flex-direction: row;
    }
    
    .marquee-content {
      flex-shrink: 0;
      display: flex;
      justify-content: space-around;
      gap: 1rem;
      animation-duration: 40s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    
    .marquee-content-horizontal {
      flex-direction: row;
      animation-name: marquee;
    }
    
    .marquee-content-vertical {
      flex-direction: column;
      animation-name: marqueeVertical;
    }
    
    .marquee-reverse {
      animation-direction: reverse;
    }
    
    .marquee-pause-hover:hover .marquee-content {
      animation-play-state: paused;
    }
  `

  return (
    <>
      <style jsx>{marqueeStyles}</style>
      <div
        {...props}
        className={cn(
          "marquee-container",
          vertical ? "marquee-vertical" : "marquee-horizontal",
          pauseOnHover && "marquee-pause-hover",
          className,
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn(
                "marquee-content",
                vertical ? "marquee-content-vertical" : "marquee-content-horizontal",
                reverse && "marquee-reverse",
              )}
            >
              {children}
            </div>
          ))}
      </div>
    </>
  )
}

