"use client";

import React from "react";
import Image from "next/image";

interface DropcapProps {
  children: string;
  width?: number;
  height?: number;
  className?: string;
  type?: string;
}

// All dropcap folders
const dropcapTypes = [
  "gothic-traditional",
  "vinework-gothic",
  "alice-in-wonderland",
  "william-morris-gothic",
];

// Which types should invert in dark mode
const darkModeInvertTypes = [
  "william-morris-gothic",
];

const Dropcap: React.FC<DropcapProps> = ({
  children,
  width = 64,
  height = 64,
  className = "",
  type = "gothic-traditional",
}) => {
  const letter = typeof children === "string" ? children.toLowerCase() : "";

  const folder = dropcapTypes.includes(type) ? type : "gothic-traditional";
  const src = `/fonts/dropcaps/${folder}/dropcap-${letter}.png`;

  const shouldInvert = darkModeInvertTypes.includes(type);

  return (
    <span
      className={`dropcap-image-wrapper ${className}`}
      style={{
        display: "inline-block",
        lineHeight: 0,
        verticalAlign: "top",
        margin: "0.5rem 0 0 0",
        padding: 0
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span
        className={`${shouldInvert ? "dark:invert" : ""}`}
        style={{
          display: "inline-block",
          margin: 0,
          padding: 0
        }}
      >
        <Image
          src={src}
          alt={`Dropcap ${letter}`}
          width={width}
          height={height}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="dropcap-image"
          unoptimized
          style={{
            display: "block",
            margin: 0,
            padding: 0,
            imageRendering: "crisp-edges"
          }}
        />
      </span>
    </span>
  );
};

export default Dropcap;
