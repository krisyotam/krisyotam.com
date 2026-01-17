/**
 * ============================================================================
 * Layout Wrapper Component
 * Author: Kris Yotam
 * Date: 2026-01-06
 * Filename: wrapper.tsx
 * Description: Client component boundary for lazy-loading interactive UI
 *              components. Required because Next.js 15+ disallows dynamic()
 *              with ssr:false in Server Components like layout.tsx.
 * ============================================================================
 */

"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import dynamic from "next/dynamic"
import { Suspense } from "react"

// ============================================================================
// LAZY-LOADED COMPONENTS
// ============================================================================

const CommandMenu = dynamic(
  () => import("./command-menu").then((mod) => mod.CommandMenu),
  { ssr: false }
)

const SettingsMenu = dynamic(
  () => import("./settings").then((mod) => mod.SettingsMenu),
  { ssr: false }
)

const UniversalLinkModal = dynamic(
  () => import("./popups").then((mod) => mod.UniversalLinkModal),
  { ssr: false }
)

// ============================================================================
// TYPES
// ============================================================================

interface WrapperProps {
  showModal?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Wrapper({ showModal = true }: WrapperProps) {
  return (
    <>
      <Suspense fallback={null}>
        <CommandMenu />
      </Suspense>
      <Suspense fallback={null}>
        <SettingsMenu />
      </Suspense>
      {showModal && (
        <Suspense fallback={null}>
          <UniversalLinkModal />
        </Suspense>
      )}
    </>
  )
}
