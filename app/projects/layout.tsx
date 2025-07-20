import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.projects

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
