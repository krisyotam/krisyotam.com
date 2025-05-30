import type { ReactNode } from "react"

export function LI({ children }: { children: ReactNode }) {
  return (
    <li
      className={`
        my-2
        [ul_&]:relative
        [ul_&]:pl-4
        [ul_&]:before:text-gray-400
        [ul_&]:before:content-['–']
        [ul_&]:before:mr-2
        [ul_&]:before:absolute
        [ul_&]:before:-ml-4
      `}
    >
      {children}
    </li>
  )
}

