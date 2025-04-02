import type { MDXComponents } from "mdx/types"
import Image, { type ImageProps } from "next/image"
import * as Typography from "@/components/typography"
import { InternalLink } from "@/components/internal-link"
import { EnhancedLink } from "@/components/enhanced-link"

// Define components for MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Map HTML elements to Typography components
    h1: ({ children, id }) => {
      const headingId =
        id || (typeof children === "string" ? children.toLowerCase().replace(/[^\w]+/g, "-") : undefined)
      return <Typography.H1 id={headingId}>{children}</Typography.H1>
    },
    h2: ({ children, id }) => {
      const headingId =
        id || (typeof children === "string" ? children.toLowerCase().replace(/[^\w]+/g, "-") : undefined)
      return <Typography.H2 id={headingId}>{children}</Typography.H2>
    },
    h3: ({ children, id }) => {
      const headingId =
        id || (typeof children === "string" ? children.toLowerCase().replace(/[^\w]+/g, "-") : undefined)
      return <Typography.H3 id={headingId}>{children}</Typography.H3>
    },
    h4: ({ children, id }) => {
      const headingId =
        id || (typeof children === "string" ? children.toLowerCase().replace(/[^\w]+/g, "-") : undefined)
      return <Typography.H4 id={headingId}>{children}</Typography.H4>
    },
    p: ({ children }) => <Typography.P>{children}</Typography.P>,
    a: ({ href, children, ...props }) => {
      // Use the EnhancedLink component for all links
      return (
        <EnhancedLink href={href || "#"} {...props}>
          {children}
        </EnhancedLink>
      )
    },
    blockquote: ({ children }) => <Typography.Blockquote>{children}</Typography.Blockquote>,
    ul: ({ children }) => <Typography.UL>{children}</Typography.UL>,
    ol: ({ children }) => <Typography.OL>{children}</Typography.OL>,
    li: ({ children }) => <Typography.LI>{children}</Typography.LI>,
    code: ({ children }) => <Typography.Code>{children}</Typography.Code>,
    hr: () => <Typography.HR />,
    table: ({ children }) => <table className="w-full border-collapse my-6">{children}</table>,
    th: ({ children }) => <th className="border border-border p-2 bg-muted text-left">{children}</th>,
    td: ({ children }) => <td className="border border-border p-2">{children}</td>,

    // Custom image component with Next.js Image
    img: (props) => (
      <div className="my-6 text-center">
        <Image
          sizes="100vw"
          style={{ width: "100%", height: "auto", maxWidth: "100%", margin: "0 auto" }}
          {...(props as ImageProps)}
          alt={props.alt || ""}
        />
        {props.title && <Typography.Caption>{props.title}</Typography.Caption>}
      </div>
    ),

    // Typography components
    Lead: Typography.Lead,
    Large: Typography.Large,
    Small: Typography.Small,
    Muted: Typography.Muted,
    InternalLink: InternalLink,
    ...components,
  }
}

