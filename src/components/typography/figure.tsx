import type { ReactNode } from "react"

export function Figure({ wide = false, children }: { wide?: boolean; children: ReactNode }) {
  if (wide) {
    return (
      <div
        className="w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] bg-neutral-100 dark:bg-neutral-900 py-8 my-6"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center my-6">
      {children}
    </div>
  )
}

