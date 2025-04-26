"use client"

/**
 * Dropcap component for MDX
 * Usage in MDX:
 *   import Dropcap from '@/components/dropcap'
 *   <Dropcap>p</Dropcap>
 */
import React from 'react'
import Image from 'next/image'

interface DropcapProps {
  /** Single letter to render as a dropcap */
  children: string
  /** Width of the dropcap image (default: 64) */
  width?: number
  /** Height of the dropcap image (default: 64) */
  height?: number
  /** Additional CSS classes to apply to the wrapper */
  className?: string
}

const Dropcap: React.FC<DropcapProps> = ({
  children,
  width = 64,
  height = 64,
  className = ''
}) => {
  const letter = typeof children === 'string' ? children.toLowerCase() : ''
  const src = `/fonts/dropcaps/gothic-traditional/dropcap-${letter}.png`

  return (
    <span
      className={`dropcap-image-wrapper ${className}`}
      style={{ display: 'inline-block', lineHeight: 0 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src={src}
        alt={`Dropcap ${letter}`}
        width={width}
        height={height}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="dropcap-image"
      />
    </span>
  )
}

export default Dropcap
