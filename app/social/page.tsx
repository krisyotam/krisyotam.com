import { SocialClient } from "./social-client"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.social

export default function SocialPage() {
  return <SocialClient />
} 