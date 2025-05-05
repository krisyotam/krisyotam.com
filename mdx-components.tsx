import type { MDXComponents } from "mdx/types"
import Image, { type ImageProps } from "next/image"
import * as Typography from "@/components/typography"
import { InternalLink } from "@/components/internal-link"
import { EnhancedLink } from "@/components/enhanced-link"

// Import all post-related components
import MiniBio from '@/components/posts/people/mini-bio'
import Dropcap from '@/components/dropcap'
import Bible from "@/components/references/christianity/1611bible"
import LinkTags from "@/components/link-tags"
import { Box } from "@/components/posts/typography/box"
import { Excerpt } from "@/components/posts/typography/excerpt"
import { Quote } from "@/components/posts/typography/quote"
import Define from "@/components/references/language/oed"
import { Spoiler } from "@/components/posts/typography/spoiler"
import { PoemBox } from "@/components/posts/typography/poem"
import Collapse from "@/components/posts/typography/collapse"
import FileViewer from "@/components/posts/typography/file-viewer"
import OcCharacterDisplay from "@/components/posts/characters/oc-character-display"
import Inflation from "@/components/inflation"
import { EnhancedImageDisplay } from "@/components/posts/images/enhanced-image-display"
import { Image as BasicImage } from "@/components/posts/images/basic-image-display"
import TryHackMe from "@/components/posts/ctfs/tryhackme"
import Book from "@/components/posts/books/book"
import { BookCard } from "@/components/posts/books/book-card"
import AnimeDisplay from "@/components/posts/content/anime-display"
import MangaDisplay from "@/components/posts/content/manga-display"
import MovieDisplay from "@/components/posts/content/movie-display"
import HauteCouture from "@/components/posts/fashion/haute-couture"
import HauteCoutureCollection from "@/components/posts/fashion/haute-couture-collection"
import MangaPanelDisplay from "@/components/posts/content/manga-panel-display"
import MangaPanelDisplayCollection from "@/components/posts/content/manga-panel-display-collection"
import Chateau from "@/components/posts/architecture/chateau"
import ChateauCollection from "@/components/posts/architecture/chateau-collection"
import Human from "@/components/posts/basic/human"
import Company from "@/components/posts/basic/company"

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
    
    // Text formatting and layout components
    InternalLink,
    Dropcap,
    Box,
    Excerpt,
    Quote,
    Spoiler,
    PoemBox,
    Collapse,
    FileViewer,
    
    // References and specialized components
    Bible,
    Define,
    LinkTags,
    Inflation,
    
    // Character and people components
    MiniBio,
    OcCharacterDisplay,
    Human,
    Company,
    
    // Images and media components
    EnhancedImageDisplay,
    BasicImage,
    
    // Books and reading components
    Book,
    BookCard,
    
    // Content display components
    AnimeDisplay,
    MangaDisplay,
    MovieDisplay,
    MangaPanelDisplay,
    MangaPanelDisplayCollection,
    
    // Fashion and architecture components
    HauteCouture,
    HauteCoutureCollection,
    Chateau,
    ChateauCollection,
    
    // Special content components
    TryHackMe,
    
    // Pass through any provided components (for overrides)
    ...components,
  }
}

