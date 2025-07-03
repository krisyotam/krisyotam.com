"use client";

import { ComponentType } from "react";

interface MdxRendererProps {
  component: ComponentType;
}

export default function MdxRenderer({ component: Component }: MdxRendererProps) {
  return (
    <div className="lab-content">
      <Component />
    </div>
  );
}
