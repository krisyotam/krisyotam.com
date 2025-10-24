import type { ReactNode } from "react"

export const Code = ({ children }: { children: ReactNode }) => {
  return <code className="relative rounded bg-gray-200 dark:bg-gray-800 px-1 py-0.5 font-mono text-sm">{children}</code>
}

