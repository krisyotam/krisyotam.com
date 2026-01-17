import type { ReactNode } from "react"

export function Small({ children }: { children: ReactNode }) {
  return <small className="text-sm font-medium leading-none block mb-4">{children}</small>
}

