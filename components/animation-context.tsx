"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface AnimationContextType {
  isAnyAnimating: boolean
  setIsAnimating: (isAnimating: boolean) => void
}

const defaultContext: AnimationContextType = {
  isAnyAnimating: false,
  setIsAnimating: () => {},
}

const AnimationContext = createContext<AnimationContextType>(defaultContext)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAnyAnimating, setIsAnyAnimating] = useState(false)

  const setIsAnimating = (isAnimating: boolean) => {
    setIsAnyAnimating(isAnimating)
  }

  return <AnimationContext.Provider value={{ isAnyAnimating, setIsAnimating }}>{children}</AnimationContext.Provider>
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    console.error("useAnimation must be used within an AnimationProvider")
    return defaultContext
  }
  return context
}

