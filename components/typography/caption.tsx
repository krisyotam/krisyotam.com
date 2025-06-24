import type { ReactNode } from "react"

export function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="block w-full text-xs my-3 font-mono text-gray-500 dark:text-gray-400 text-center leading-normal">
      {children}
    </span>
  )
}

