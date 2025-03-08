import type { ReactNode } from "react"
import { A } from "./a"
import { P } from "./p"

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

export const FootNote = ({ id, children }: { id: string; children: ReactNode }) => (
  <P>
    {id}.{" "}
    <A href={`#s${id}`} id={`f${id}`} className="no-underline">
      ^
    </A>{" "}
    {children}
  </P>
)

