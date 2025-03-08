import type { ReactNode } from "react"

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">{children}</h1>
}

