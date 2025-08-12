import type { ReactNode } from "react"

export function UL({ children }: { children: ReactNode }) {
  return <ul className="my-6 ml-6 list-disc">{children}</ul>
}

