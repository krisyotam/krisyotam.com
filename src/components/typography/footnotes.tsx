import type { ReactNode } from "react"
import { A } from "./a"

export const FootNotes = ({ children }: { children: ReactNode }) => (
  <div className="text-base before:w-[200px] before:m-auto before:content-[''] before:border-t before:border-gray-300 dark:before:border-gray-700 before:block before:my-10">
    {children}
  </div>
)

export const Ref = ({ id }: { id: string }) => (
  <a href={`#f${id}`} id={`s${id}`} className="relative text-xs top-[-5px] no-underline">
    [{id}]
  </a>
)

interface AProps {
  href: string
  id?: string
  className?: string
  children: React.ReactNode
}

export function Footnote({ id, children }: { id: string; children: string }) {
  return (
    <A href={`#s${id}`} id={`f${id}`} className="no-underline">
      {children}
    </A>
  )
}

export const FootNote = ({ id, children }: { id: string; children: ReactNode }) => (
  <p>
    {id}.{" "}
    <A href={`#s${id}`} id={`f${id}`} className="no-underline">
      ^
    </A>{" "}
    {children}
  </p>
)

