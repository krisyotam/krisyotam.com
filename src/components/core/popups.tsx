"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                              POPUPS.TSX                                   ║
 * ║                     Floating Link Preview System                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-02                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A floating popup system for previewing links on hover.                   ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Hover-triggered iframe previews for external links                     ║
 * ║  • Draggable windows with snap-to-grid zoom positions (3x3)               ║
 * ║  • Pin/unpin to persist popups across navigation                          ║
 * ║  • Minimize to taskbar with restore functionality                         ║
 * ║  • Keyboard shortcuts for power users                                     ║
 * ║  • Multi-modal navigation with arrow keys                                 ║
 * ║                                                                           ║
 * ║  Keyboard Shortcuts:                                                      ║
 * ║  • Esc: Close focused popup (Alt+Esc: close all)                          ║
 * ║  • c: Toggle pin (Alt+c: pin/unpin all)                                   ║
 * ║  • t: Minimize to taskbar                                                 ║
 * ║  • r: Restore from zoom                                                   ║
 * ║  • q/w/e/a/f/d/z/s/x: Snap to 9 grid positions                            ║
 * ║  • ←/→: Navigate between popups                                           ║
 * ║                                                                           ║
 * ║  Based on: gwern.net/static/js/popups.js                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { X, Maximize2, ChevronLeft, ChevronRight, Copy, ExternalLink, Check, Minimize2, Pin, PinOff, Shrink, Square, PanelBottomClose } from "lucide-react"
import { linkEvents } from "@/components/typography/a"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  hoverDelay: 500,
  submenuTimeout: 150,
  excludedPages: ["/", "/categories"],
}

/* ═══════════════════════════════════════════════════════════════════════════
   BANNED DOMAINS
   Domains that should not show link previews (iframe restrictions, etc.)
   ═══════════════════════════════════════════════════════════════════════════ */

const BANNED_DOMAINS = [
  { name: "Amazon", domain: "amazon.com" },
  { name: "Oxford English Dictionary", domain: "oed.com" },
  { name: "Github", domain: "github.com" },
  { name: "Youtube", domain: "youtube.com" },
  { name: "Localhost", domain: "localhost" },
  { name: "Hetzner", domain: "hetzner.com" },
  { name: "Substack", domain: "substack.com" },
  { name: "Stripe", domain: "stripe.com" },
  { name: "TikTok", domain: "tiktok.com" },
  { name: "Medium", domain: "medium.com" },
] as const

const DEFAULT_SIZE = { width: 600, height: 500 }

const ZOOM_SHORTCUTS: Record<string, ZoomPosition> = {
  q: "top-left", w: "top", e: "top-right",
  a: "left", f: "full", d: "right",
  z: "bottom-left", s: "bottom", x: "bottom-right",
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type ZoomPosition = "top-left" | "top" | "top-right" | "left" | "full" | "right" | "bottom-left" | "bottom" | "bottom-right" | null

type Modal = {
  id: string
  url: string
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isPinned: boolean
  isMinimized: boolean
  zoomPosition: ZoomPosition
  savedPosition?: { x: number; y: number }
  savedSize?: { width: number; height: number }
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

const getDomain = (url: string) => {
  try { return new URL(url).hostname.replace("www.", "") }
  catch { return url }
}

const getZoomDimensions = (pos: ZoomPosition) => {
  const [vw, vh, p] = [window.innerWidth, window.innerHeight, 10]
  const half = { w: vw / 2 - p * 1.5, h: vh / 2 - p * 1.5 }
  const full = { w: vw - p * 2, h: vh - p * 2 }
  const positions: Record<string, { x: number; y: number; width: number; height: number }> = {
    "top-left": { x: p, y: p, width: half.w, height: half.h },
    "top": { x: p, y: p, width: full.w, height: half.h },
    "top-right": { x: vw / 2 + p / 2, y: p, width: half.w, height: half.h },
    "left": { x: p, y: p, width: half.w, height: full.h },
    "full": { x: p, y: p, width: full.w, height: full.h },
    "right": { x: vw / 2 + p / 2, y: p, width: half.w, height: full.h },
    "bottom-left": { x: p, y: vh / 2 + p / 2, width: half.w, height: half.h },
    "bottom": { x: p, y: vh / 2 + p / 2, width: full.w, height: half.h },
    "bottom-right": { x: vw / 2 + p / 2, y: vh / 2 + p / 2, width: half.w, height: half.h },
  }
  return positions[pos as string] || { x: vw / 2, y: vh / 2, width: 600, height: 500 }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ZOOM POSITION ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

const ZoomIcon = ({ pos, className }: { pos: ZoomPosition; className?: string }) => {
  const cls = cn("h-4 w-4", className)
  const paths: Record<string, string> = {
    "top-left": "M4 4h7M4 4v7M4 4l8 8M20 20h-7M20 20v-7M20 20l-8-8",
    "top": "M4 4h16M4 4v5M20 4v5M12 4v8M8 8l4-4 4 4",
    "top-right": "M20 4h-7M20 4v7M20 4l-8 8M4 20h7M4 20v-7M4 20l8-8",
    "left": "M4 4v16M4 4h5M4 20h5M4 12h8M8 8l-4 4 4 4",
    "right": "M20 4v16M20 4h-5M20 20h-5M20 12h-8M16 8l4 4-4 4",
    "bottom-left": "M4 20h7M4 20v-7M4 20l8-8M20 4h-7M20 4v7M20 4l-8 8",
    "bottom": "M4 20h16M4 20v-5M20 20v-5M12 20v-8M8 16l4 4 4-4",
    "bottom-right": "M20 20h-7M20 20v-7M20 20l-8-8M4 4h7M4 4v7M4 4l8 8",
  }
  if (pos === "full" || !pos) return <Maximize2 className={cls} />
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={paths[pos]} /></svg>
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function Popups() {
  const pathname = usePathname()
  const isExcluded = useMemo(() => CONFIG.excludedPages.some(p => pathname === p || pathname?.startsWith(`${p}/`)), [pathname])

  // ─── State ─────────────────────────────────────────────────────────────────
  const [isEnabled, setIsEnabled] = useState(true)
  const [mode, setMode] = useState<"all" | "external" | "off">("external")
  const [modals, setModals] = useState<Modal[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [drag, setDrag] = useState<{ active: boolean; id: string | null; offset: { x: number; y: number } }>({ active: false, id: null, offset: { x: 0, y: 0 } })
  const [submenu, setSubmenu] = useState<{ zoom: string | null; minimize: string | null }>({ zoom: null, minimize: null })
  const [ready, setReady] = useState(false)

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const openUrls = useRef<Set<string>>(new Set())
  const timers = useRef<{ hover: NodeJS.Timeout | null; zoom: NodeJS.Timeout | null; minimize: NodeJS.Timeout | null; hovered: HTMLAnchorElement | null }>({ hover: null, zoom: null, minimize: null, hovered: null })

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const isBanned = useCallback((url: string) => {
    const domain = getDomain(url)
    return BANNED_DOMAINS.some(b => domain === b.domain || domain.endsWith(`.${b.domain}`))
  }, [])

  const isInternal = useCallback((url: string) => {
    if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) return true
    try { return new URL(url).hostname === window.location.hostname } catch { return true }
  }, [])

  const shouldPreview = useCallback((url: string) => {
    if (isBanned(url)) return false
    return isInternal(url) ? mode === "all" : mode !== "off"
  }, [isBanned, isInternal, mode])

  // ─── Modal Actions ─────────────────────────────────────────────────────────
  const updateModal = useCallback((id: string, updates: Partial<Modal>) => {
    setModals(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }, [])

  const focusModal = useCallback((id: string) => {
    setFocusedId(id)
    setModals(prev => [...prev.filter(m => m.id !== id), prev.find(m => m.id === id)!].filter(Boolean))
  }, [])

  const createModal = useCallback((url: string, title: string) => {
    if (openUrls.current.has(url) || !url || url === "#" || url.startsWith("javascript:")) return
    if (isBanned(url) || (isInternal(url) && mode !== "all")) return
    const id = `popup-${Date.now()}`
    const modal: Modal = {
      id, url, title: title || getDomain(url),
      position: { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 250 },
      size: { ...DEFAULT_SIZE }, isPinned: false, isMinimized: false, zoomPosition: null,
    }
    setModals(prev => [...prev, modal])
    openUrls.current.add(url)
    setFocusedId(id)
  }, [isBanned, isInternal, mode])

  const closeModal = useCallback((id: string) => {
    const modal = modals.find(m => m.id === id)
    if (modal) openUrls.current.delete(modal.url)
    setModals(prev => prev.filter(m => m.id !== id))
    if (focusedId === id) {
      const remaining = modals.filter(m => m.id !== id)
      setFocusedId(remaining.length ? remaining.at(-1)!.id : null)
    }
  }, [modals, focusedId])

  const closeAll = useCallback(() => {
    modals.forEach(m => openUrls.current.delete(m.url))
    setModals([])
    setFocusedId(null)
  }, [modals])

  const zoomTo = useCallback((id: string, pos: ZoomPosition) => {
    const modal = modals.find(m => m.id === id)
    if (!modal) return
    if (!pos) {
      updateModal(id, { zoomPosition: null, position: modal.savedPosition || modal.position, size: modal.savedSize || modal.size })
    } else {
      const dims = getZoomDimensions(pos)
      updateModal(id, {
        savedPosition: modal.zoomPosition === null ? modal.position : modal.savedPosition,
        savedSize: modal.zoomPosition === null ? modal.size : modal.savedSize,
        zoomPosition: pos, position: { x: dims.x, y: dims.y }, size: { width: dims.width, height: dims.height },
      })
    }
    setSubmenu(s => ({ ...s, zoom: null }))
  }, [modals, updateModal])

  const minimize = useCallback((id: string) => {
    const modal = modals.find(m => m.id === id)
    if (!modal) return
    updateModal(id, { isMinimized: true, savedPosition: modal.savedPosition || modal.position, savedSize: modal.savedSize || modal.size })
    setSubmenu(s => ({ ...s, minimize: null }))
  }, [modals, updateModal])

  const restoreSize = useCallback((id: string) => {
    updateModal(id, { zoomPosition: null, size: { ...DEFAULT_SIZE }, position: { x: window.innerWidth / 2 - DEFAULT_SIZE.width / 2, y: window.innerHeight / 2 - DEFAULT_SIZE.height / 2 } })
    setSubmenu(s => ({ ...s, minimize: null }))
  }, [updateModal])

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback((dir: 1 | -1) => {
    const visible = modals.filter(m => !m.isMinimized)
    if (visible.length <= 1) return
    const idx = visible.findIndex(m => m.id === focusedId)
    focusModal(visible[(idx + dir + visible.length) % visible.length].id)
  }, [modals, focusedId, focusModal])

  // ─── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsEnabled(localStorage.getItem("settings_universalLinkModal") !== "false")
    const stored = localStorage.getItem("settings_universalLinkModalMode")
    if (stored && ["all", "external", "off"].includes(stored)) setMode(stored as typeof mode)
    setReady(true)
  }, [])

  useEffect(() => { if (copied) { const t = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(t) } }, [copied])

  // Dragging
  useEffect(() => {
    if (!drag.active) return
    const onMove = (e: MouseEvent) => {
      const modal = modals.find(m => m.id === drag.id)
      if (!modal) return
      const x = Math.max(0, Math.min(e.clientX - drag.offset.x, window.innerWidth - modal.size.width))
      const y = Math.max(0, Math.min(e.clientY - drag.offset.y, window.innerHeight - modal.size.height))
      updateModal(modal.id, { position: { x, y } })
    }
    const onUp = () => setDrag({ active: false, id: null, offset: { x: 0, y: 0 } })
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [drag, modals, updateModal])

  // Link hover detection
  useEffect(() => {
    const hasNoPreview = (el: HTMLElement | null): boolean => {
      while (el) { if (el.getAttribute("data-no-preview") === "true" || el.getAttribute("data-no-modal") === "true") return true; el = el.parentElement }
      return false
    }
    const onOver = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null
      if (!link || link.hasAttribute("data-hover-listener") || hasNoPreview(link)) return
      const href = link.href
      if (!href || href === "#" || href.startsWith("javascript:") || isBanned(href) || !shouldPreview(href)) {
        link.setAttribute("data-no-preview", "true"); return
      }
      if (timers.current.hovered === link) return
      if (timers.current.hover) clearTimeout(timers.current.hover)
      timers.current.hovered = link
      timers.current.hover = setTimeout(() => { if (timers.current.hovered === link) createModal(href, link.textContent || "") }, CONFIG.hoverDelay)
    }
    const onOut = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a")
      if (link && timers.current.hovered === link) { if (timers.current.hover) clearTimeout(timers.current.hover); timers.current.hovered = null }
    }
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)
    return () => { document.removeEventListener("mouseover", onOver); document.removeEventListener("mouseout", onOut) }
  }, [isBanned, shouldPreview, createModal])

  // Link events from A component
  useEffect(() => {
    const unsubscribe = linkEvents.addListener((url, text) => { if (!isBanned(url) && shouldPreview(url)) createModal(url, text) })
    return () => { unsubscribe() }
  }, [isBanned, shouldPreview, createModal])

  // Custom event for external triggers
  useEffect(() => {
    const handler = (e: CustomEvent) => { const { url, title } = e.detail; if (isEnabled && mode !== "off" && shouldPreview(url)) createModal(url, title) }
    window.addEventListener("openUniversalLinkModal", handler as EventListener)
    return () => window.removeEventListener("openUniversalLinkModal", handler as EventListener)
  }, [isEnabled, mode, shouldPreview, createModal])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const modal = modals.find(m => m.id === focusedId)
      if (!modal) return
      if (e.key === "Escape") { e.altKey ? closeAll() : closeModal(modal.id); return }
      if (e.key === "ArrowRight") { navigate(1); return }
      if (e.key === "ArrowLeft") { navigate(-1); return }
      if (e.key === "c") { e.altKey ? setModals(prev => prev.map(m => ({ ...m, isPinned: !modal.isPinned }))) : updateModal(modal.id, { isPinned: !modal.isPinned }); return }
      if (e.key === "t") { minimize(modal.id); return }
      if (e.key === "r") { zoomTo(modal.id, null); return }
      if (ZOOM_SHORTCUTS[e.key]) { zoomTo(modal.id, ZOOM_SHORTCUTS[e.key]); return }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modals, focusedId, closeModal, closeAll, navigate, updateModal, minimize, zoomTo])

  if (!ready || !isEnabled || mode === "off" || isExcluded) return null

  // ─── Submenu Hover Handlers ────────────────────────────────────────────────
  const submenuHandlers = (type: "zoom" | "minimize", id: string) => ({
    onMouseEnter: () => { if (timers.current[type]) clearTimeout(timers.current[type]!); setSubmenu(s => ({ ...s, [type]: id })) },
    onMouseLeave: () => { timers.current[type] = setTimeout(() => setSubmenu(s => ({ ...s, [type]: null })), CONFIG.submenuTimeout) },
  })

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  const renderZoomSubmenu = (id: string, isVisible: boolean) => {
    const modal = modals.find(m => m.id === id)
    const grid = [["top-left", "top", "top-right"], ["left", "full", "right"], ["bottom-left", "bottom", "bottom-right"]] as const
    return (
      <div className="absolute z-[9999]" style={{ top: "100%", left: 0, marginTop: 2, visibility: isVisible ? "visible" : "hidden", opacity: isVisible ? 1 : 0, transition: "all 0.15s" }} {...submenuHandlers("zoom", id)}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 28px)", gridTemplateRows: "repeat(3, 28px)", gap: 1, padding: 1, backgroundColor: "hsl(var(--border))", border: "2px solid hsl(var(--border))", boxShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}>
          {grid.flat().map(pos => {
            const active = modal?.zoomPosition === pos
            const key = Object.entries(ZOOM_SHORTCUTS).find(([, v]) => v === pos)?.[0]
            return (
              <button key={pos} onClick={e => { e.stopPropagation(); zoomTo(id, active ? null : pos) }} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: active ? "hsl(var(--muted))" : "hsl(var(--background))", border: "none", cursor: "pointer", padding: 0 }} className="hover:bg-muted transition-colors" title={`[${key}]: ${pos}${active ? " (restore)" : ""}`}>
                {active ? <Shrink className="h-3.5 w-3.5 text-foreground" /> : <ZoomIcon pos={pos} className="text-muted-foreground" />}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMinimizeSubmenu = (id: string, isVisible: boolean) => (
    <div className="absolute z-[9999]" style={{ top: "100%", left: 0, visibility: isVisible ? "visible" : "hidden", opacity: isVisible ? 1 : 0, transition: "all 0.15s" }} {...submenuHandlers("minimize", id)}>
      <div className="flex flex-col border-2 border-border bg-border gap-px" style={{ boxShadow: "2px 2px 0 0 rgba(0,0,0,0.1)" }}>
        <button onClick={e => { e.stopPropagation(); minimize(id) }} className="px-3 py-1.5 flex items-center gap-2 bg-background hover:bg-muted transition-colors text-sm whitespace-nowrap" title="[t]: Minimize to taskbar">
          <PanelBottomClose className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Minimize to taskbar</span>
        </button>
        <button onClick={e => { e.stopPropagation(); restoreSize(id) }} className="px-3 py-1.5 flex items-center gap-2 bg-background hover:bg-muted transition-colors text-sm whitespace-nowrap" title="Restore to default size">
          <Square className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Restore to tab size</span>
        </button>
      </div>
    </div>
  )

  const renderTitleBar = (modal: Modal, isFocused: boolean) => {
    const zoomed = modal.zoomPosition !== null
    const btnCls = "p-1.5 text-muted-foreground hover:text-foreground transition-colors active:scale-90"
    return (
      <div className={cn("relative flex items-center justify-between h-8 border-b-2 border-border drag-handle", drag.active && drag.id === modal.id ? "cursor-grabbing" : "cursor-grab")} style={{ backgroundColor: "hsl(var(--muted))", backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(128,128,128,0.1) 2px, rgba(128,128,128,0.1) 4px)", backgroundSize: "8px 8px" }} onMouseDown={e => { if ((e.target as HTMLElement).closest("button")) return; const m = modals.find(x => x.id === modal.id); if (m && !m.zoomPosition) { setDrag({ active: true, id: modal.id, offset: { x: e.clientX - m.position.x, y: e.clientY - m.position.y } }); focusModal(modal.id); e.preventDefault() } }}>
        {renderZoomSubmenu(modal.id, submenu.zoom === modal.id)}
        {renderMinimizeSubmenu(modal.id, submenu.minimize === modal.id)}
        <div className="flex items-center">
          <button onClick={e => { e.stopPropagation(); e.altKey ? closeAll() : closeModal(modal.id) }} className={btnCls} title="[Esc]: Close (Alt+Esc: all)"><X className="h-4 w-4" /></button>
          <button onClick={e => { e.stopPropagation(); zoomTo(modal.id, zoomed ? null : "full") }} {...submenuHandlers("zoom", modal.id)} className={btnCls} title={zoomed ? "[r]: Restore" : "[f]: Maximize"}>{zoomed ? <Shrink className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
          <button onClick={e => { e.stopPropagation(); e.altKey ? setModals(prev => prev.map(m => ({ ...m, isPinned: !modal.isPinned }))) : updateModal(modal.id, { isPinned: !modal.isPinned }) }} className={cn(btnCls, modal.isPinned && "text-foreground")} title={modal.isPinned ? "[c]: Unpin" : "[c]: Pin"}>{modal.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}</button>
          <button onClick={e => { e.stopPropagation(); minimize(modal.id) }} {...submenuHandlers("minimize", modal.id)} className={btnCls} title="[t]: Minimize"><Minimize2 className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 px-4 truncate text-center text-sm font-medium text-muted-foreground">{modal.title}</div>
        {isFocused && (
          <div className="flex items-center">
            <button onClick={() => { navigator.clipboard.writeText(modal.url); setCopied(true) }} className={btnCls} title="Copy URL">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
            <button onClick={() => window.open(modal.url, "_blank", "noopener,noreferrer")} className={btnCls} title="Open in new tab"><ExternalLink className="h-4 w-4" /></button>
            {modals.filter(m => !m.isMinimized).length > 1 && (<>
              <div className="h-4 border-l border-border mx-1" />
              <button onClick={() => navigate(-1)} className="p-1.5 text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-xs text-muted-foreground px-1">{modals.filter(m => !m.isMinimized).findIndex(m => m.id === focusedId) + 1}/{modals.filter(m => !m.isMinimized).length}</span>
              <button onClick={() => navigate(1)} className="p-1.5 text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
            </>)}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Active Popups */}
      {modals.filter(m => !m.isMinimized).map((modal, i) => {
        const isFocused = modal.id === focusedId
        return (
          <div key={modal.id} className={cn("fixed overflow-hidden flex flex-col", isFocused ? "shadow-2xl" : "shadow-xl")} style={{ left: modal.position.x, top: modal.position.y, width: modal.size.width, height: modal.size.height, zIndex: 1000 + i + (isFocused ? 100 : 0), border: `3px double ${isFocused ? "hsl(var(--foreground))" : "hsl(var(--border))"}`, backgroundColor: "hsl(var(--background))" }} onClick={() => focusModal(modal.id)}>
            {renderTitleBar(modal, isFocused)}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" /></div>
              <iframe src={modal.url} className="w-full h-full border-0" title={`Preview: ${modal.url}`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" onLoad={e => { const p = e.currentTarget.parentElement; if (p?.firstChild !== e.currentTarget) p?.firstChild?.remove() }} />
            </div>
          </div>
        )
      })}
      {/* Minimized Taskbar */}
      {modals.some(m => m.isMinimized) && (
        <div className="fixed bottom-0 left-0 max-w-[60%] h-10 bg-muted/80 backdrop-blur border-t border-r border-border flex items-center gap-2 px-2 z-[1200]">
          {modals.filter(m => m.isMinimized).map(m => (
            <button key={m.id} onClick={() => updateModal(m.id, { isMinimized: false })} className="px-3 py-1 bg-background border border-border text-sm truncate max-w-[200px] hover:bg-muted transition-colors" title={`Restore: ${m.title}`}>{m.title || getDomain(m.url)}</button>
          ))}
        </div>
      )}
    </>
  )
}

export { Popups as UniversalLinkModal }
