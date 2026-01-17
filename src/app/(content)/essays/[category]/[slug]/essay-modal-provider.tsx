"use client"

import type React from "react"

import { BlogLinkModal } from "@/components/blog-link-modal"

export function EssayModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BlogLinkModal />
    </>
  )
}

