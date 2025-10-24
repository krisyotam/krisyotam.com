import type { ReactNode } from "react"

export function Large({ children }: { children: ReactNode }) {
  return <div className="text-lg font-semibold mb-4">{children}</div>
}

