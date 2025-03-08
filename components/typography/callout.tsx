import type { ReactNode } from "react"

export const Callout = ({
  emoji = null,
  text = null,
  children,
}: {
  emoji?: string | null
  text?: string | null
  children?: ReactNode
}) => (
  <div className="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 flex items-start p-3 my-6 text-base rounded">
    <span className="block w-6 text-center mr-2 scale-[1.2]">{emoji}</span>
    <span className="block grow">{text ?? children}</span>
  </div>
)

