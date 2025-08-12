import type { ReactNode } from "react"

export function OL({ children }: { children: ReactNode }) {
  return <ol className="my-6 ml-6 list-decimal">{children}</ol>
}

