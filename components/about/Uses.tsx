import React, { useEffect, useRef, useState } from "react"
import usesData from "../../data/uses.json"

const sectionOrder = [
  { key: "hardware", label: "Hardware" },
  { key: "camera", label: "Camera" },
  { key: "peripherals", label: "Peripherals" },
  { key: "software", label: "Software" },
  { key: "os", label: "Operating System" },
  { key: "services", label: "Services" },
  { key: "website", label: "Website" },
] as const

type SectionKey = typeof sectionOrder[number]["key"]
type UsesItem = { label: string; value: string; note?: string }
type UsesData = Record<SectionKey, UsesItem[]>

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-10 w-10 flex items-center justify-center border border-border bg-background text-foreground rounded-none transition-colors ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-muted/50"
      }`}
      aria-label={direction === "left" ? "Previous section" : "Next section"}
      style={{ borderRadius: 0 }}
    >
      {direction === "left" ? (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
}

function UsesSectionCard({
  section,
  label,
  className,
}: {
  section: UsesItem[]
  label: string
  className?: string
}) {
  return (
    <div
      className={`w-full h-full bg-card border border-border p-5 flex flex-col gap-3 justify-center items-start rounded-none transition-colors ${className ?? ""}`}
    >
      <h2 className="text-sm uppercase tracking-wide text-muted-foreground mb-3">{label}</h2>
      <ul className="w-full space-y-2">
        {(Array.isArray(section) ? section : []).map((item, idx) => (
          <li key={idx} className="flex flex-col">
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="text-muted-foreground text-sm">{item.value}</span>
            {item.note && (
              <span className="text-xs text-accent-foreground italic">{item.note}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Uses() {
  const [current, setCurrent] = useState(0)
  const total = sectionOrder.length
  const goLeft = () => setCurrent((c) => Math.max(0, c - 1))
  const goRight = () => setCurrent((c) => Math.min(total - 1, c + 1))

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const measureRefs = useRef<(HTMLDivElement | null)[]>([])
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null)
  const [maxHeight, setMaxHeight] = useState<number | null>(null)

  // Keep the hidden measurers in sync
  if (measureRefs.current.length !== sectionOrder.length) {
    measureRefs.current = Array(sectionOrder.length).fill(null)
  }

  // Measure width of the visible wrapper (so hidden clones wrap text identically)
  useEffect(() => {
    const calcWidth = () => {
      if (wrapperRef.current) {
        const w = wrapperRef.current.getBoundingClientRect().width
        setWrapperWidth(w)
      }
    }
    calcWidth()
    window.addEventListener("resize", calcWidth)
    return () => window.removeEventListener("resize", calcWidth)
  }, [])

  // Measure heights of all sections offscreen, take the max, lock `height`
  useEffect(() => {
    if (!wrapperWidth) return
    const heights = measureRefs.current.map((el) => (el ? el.getBoundingClientRect().height : 0))
    const max = Math.max(0, ...heights)
    if (max > 0) setMaxHeight(Math.ceil(max))
  }, [wrapperWidth, usesData]) // re-measure if layout width changes (or data changes)

  const { key, label } = sectionOrder[current]
  const sectionCandidate = (usesData as Partial<UsesData>)[key]
  const section: UsesItem[] = Array.isArray(sectionCandidate) ? (sectionCandidate as UsesItem[]) : []

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Visible card wrapper with hard-locked height */}
      <div ref={wrapperRef} style={maxHeight ? { height: `${maxHeight}px`, width: "100%" } : { width: "100%" }}>
        <UsesSectionCard section={section} label={label} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full max-w-2xl mt-4">
        <ArrowButton direction="left" onClick={goLeft} disabled={current === 0} />
        <div className="flex gap-2 mx-4 flex-1 justify-center">
          {sectionOrder.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-5 rounded-none ${idx === current ? "bg-foreground/70" : "bg-border"}`}
              style={{ borderRadius: 0 }}
            />
          ))}
        </div>
        <ArrowButton direction="right" onClick={goRight} disabled={current === total - 1} />
      </div>

      {/* Offscreen measurers: identical markup, real content, same width */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute",
          visibility: "hidden",
          left: 0,
          top: 0,
          width: wrapperWidth ? `${wrapperWidth}px` : undefined,
          // allow natural height
        }}
      >
        {sectionOrder.map(({ key, label }, i) => {
          const secCandidate = (usesData as Partial<UsesData>)[key]
          const sec: UsesItem[] = Array.isArray(secCandidate) ? (secCandidate as UsesItem[]) : []
          return (
            <div
              key={key}
              ref={(el) => { measureRefs.current[i] = el }}
              // isolate each measurement block
              style={{ contain: "layout size" }}
            >
              <UsesSectionCard section={sec} label={label} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
