import type { ReactNode } from "react"

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h3>
}

