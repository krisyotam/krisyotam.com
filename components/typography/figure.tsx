import type { ReactNode } from "react"

export function Figure({ wide = false, children }: { wide?: boolean; children: ReactNode }) {
  return (
    <div
      className={`
        text-center
        ${
          wide
            ? `
            bg-gray-100
            dark:bg-gray-800
            relative
            before:bg-gray-100
            before:dark:bg-gray-800
            before:w-[10000%]
            before:h-[100%]
            before:content-[""]
            before:top-[0]
            before:left-[-1000px]
            before:absolute
            before:z-[-1]
          `
            : ""
        }
      `}
    >
      {children}
    </div>
  )
}

