import type { ReactNode } from "react";
import { Caption } from "./caption";

// Inline code component
export const Code = ({ children }: { children: ReactNode }) => {
  return (
    <code
      className={`
        [p_&]:text-sm
        [p_&]:px-1
        [p_&]:py-0.5
        [p_&]:rounded-none
        [p_&]:bg-neutral-200
        dark:[p_&]:bg-[#333]
      `}
    >
      {children}
    </code>
  );
};

// Code block component (for pre blocks)
export const CodeBlock = ({
  children,
  scroll = true,
  caption = null,
}: {
  children: ReactNode
  scroll?: boolean
  caption?: ReactNode | null
}) => {
  return (
    <div className="my-6">
      <pre
        className={`
        p-4
        text-sm
        rounded-none
        bg-neutral-200 text-neutral-700
        dark:bg-[#222] dark:text-gray-300

        ${
          scroll
            ? "overflow-scroll"
            : "whitespace-pre-wrap break-all overflow-hidden"
        }
      `}
      >
        <code>{children}</code>
      </pre>

      {caption != null ? <Caption>{caption}</Caption> : null}
    </div>
  );
};
