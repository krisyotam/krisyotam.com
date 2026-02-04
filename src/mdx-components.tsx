import type { MDXComponents } from "mdx/types"
import React from "react"
import Image, { type ImageProps } from "next/image"
import * as Typography from "@/components/typography"
import { Spoiler } from "spoiled"
import SimpleBib from "@/components/core/simplebib"
import Books from "@/components/posts/books/books"
import Cinema from "@/components/posts/books/cinema"
import { Tweet } from "@/components/typography/tweet"
import { Pfp } from "@/components/typography/pfp"
import Redacted from "@/components/typography/redacted"
import DateComponent from "@/components/core/time-stamp"
import TikZ from '@/components/typography/tikz'
import { CodeBlock } from '@/components/typography/code'

// Import all post-related components
import MiniBio from '@/components/posts/people/mini-bio'
import Dropcap from '@/components/core/dropcap'
import Bible from "@/components/references/christianity/1611bible"
import { Box } from "@/components/posts/typography/box"
import { Column, ColumnContainer } from "@/components/posts/typography/column"
import NameBreakdown from '@/components/about/name-breakdown'
import { Age } from "@/components/posts/typography/age"
import { Excerpt } from "@/components/posts/typography/excerpt"
import { Quote } from "@/components/posts/typography/quote"
import Define from "@/components/references/language/oed"
import { PoemBox } from "@/components/posts/typography/poem"
import Collapse from "@/components/posts/typography/collapse"
import FileViewer from "@/components/posts/typography/file-viewer"
import Essay from "@/components/posts/typography/essay"
import Notice from "@/components/posts/typography/notice"
import Inflation from "@/components/core/inflation"
import IconDemo from "@/components/core/icon-demo"
import { Img } from "@/components/core/img"
import { Video } from "@/components/core/video"
import TryHackMe from "@/components/posts/ctfs/tryhackme"
import Book from "@/components/posts/books/book"
import { BookCard } from "@/components/posts/books/book-card"
import AnimeDisplay from "@/components/posts/content/anime-display"
import MangaDisplay from "@/components/posts/content/manga-display"
import MovieDisplay from "@/components/posts/content/movie-display"
import Movie from "@/components/posts/media/movie"
import HauteCouture from "@/components/posts/fashion/haute-couture"
import { Verse } from "@/components/content/verse"
import HauteCoutureCollection from "@/components/posts/fashion/haute-couture-collection"
import MangaPanelDisplay from "@/components/posts/content/manga-panel-display"
import MangaPanelDisplayCollection from "@/components/posts/content/manga-panel-display-collection"
import { QuotesFeed } from "@/components/quotes/quotes-feed"; // Add this import
import { Tree } from "@/components/about/family-tree"
import WebsiteDemo from "@/components/core/website-demo"
import { WikiPerson } from "@/components/posts/wikipedia/wiki-person"
import { WikiFilm } from "@/components/posts/wikipedia/wiki-film"
import { RedditEmbed } from "@/components/typography/reddit-embed"
import AnimeCharacterDisplay from "@/components/posts/content/anime-character-display"
import { Art, Art7x4 } from "@/components/core/art"
import RatingDisplay from "@/components/posts/content/rating"
import Paper from "@/components/typography/paper"
import { Math } from "@/components/typography/math"

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
      return (
        <Typography.A href={href || "#"} {...props}>
          {children}
        </Typography.A>
      )
    },
    blockquote: ({ children }) => <Typography.Blockquote>{children}</Typography.Blockquote>,
    ul: ({ children }) => <Typography.UL>{children}</Typography.UL>,
    ol: ({ children }) => <Typography.OL>{children}</Typography.OL>,
    li: ({ children }) => <Typography.LI>{children}</Typography.LI>,
    code: ({ children }) => <Typography.Code>{children}</Typography.Code>,
    hr: () => <Typography.HR />,
    table: ({ children }) => <table className="w-full border-collapse my-6" data-mdx-table="true">{children}</table>,
    
    // Handle code blocks with CodeBlock component (rauchg style)
    pre: ({ children }) => {
      // Type for code element children
      interface CodeProps { className?: string; children?: React.ReactNode }

      // Extract code content from children
      let codeContent = children;
      if (React.isValidElement<CodeProps>(children) && children.props?.children) {
        codeContent = children.props.children;
      }

      return <CodeBlock>{codeContent}</CodeBlock>;
    },
    // Custom table components with explicit styling to prevent boldness
    th: ({ children, ...props }) => (
      <th 
        className="border border-border p-2 bg-muted text-left" 
        style={{ fontWeight: 600 }} 
        data-mdx-th="true" 
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td 
        className="border border-border p-2" 
        style={{ fontWeight: 'normal !important' }} 
        data-mdx-td="true" 
        {...props}
      >
        {children}
      </td>
    ),

    // Image component
    img: Img,

    // Custom components
    Tikz: TikZ,
    Tweet,
  Date: DateComponent,
    SimpleBib,
    Books,
    Cinema,
    Box,
    Column,
    ColumnContainer,
    Collapse,
    Quote,
    MiniBio,
    Bible,
    NameBreakdown,
    Define,
    Book,
    AnimeDisplay,
    MangaDisplay,
    MangaPanel: MangaPanelDisplay,
    Dropcap,
    Paper,
    Pfp,
    Redacted,
    
    // Typography components
    Lead: Typography.Lead,
    Large: Typography.Large,
    Small: Typography.Small,
    Muted: Typography.Muted,
    FootNotes: Typography.FootNotes,
    FootNote: Typography.FootNote,
    Ref: Typography.Ref,
    Figure: Typography.Figure,
    Caption: Typography.Caption,
    
    // Text formatting and layout components
    Excerpt,
    Spoiler,
    PoemBox,
    FileViewer,
    Age,
    RedditEmbed,
    Essay,
    Notice,
    
    // References and specialized components
    Inflation,
    // People components
    Tree,
    WikiPerson,
    WikiFilm,
    
    // Images and media components
    Img,
    Video,
    
    // Books and reading components
    BookCard,
    // Content display components
    AnimeCharacterDisplay,
    MovieDisplay,
    Movie,
    MangaPanelDisplay,
    MangaPanelDisplayCollection,
    Verse,
    
    // Fashion and architecture components
    HauteCouture,
    HauteCoutureCollection,
    
    // Code components
    CodeBlock,
    
    // Special content components
    TryHackMe,
      // Website embedding component
    WebsiteDemo,
      // Art components
    Art,
    Art7x4,
    
    // Rating components
    RatingDisplay,

    // Custom quotes feed component
    QuotesFeed,

    // Demo components
    IconDemo,

    // Math component for LaTeX
    Math,

    // Pass through any provided components (for overrides)
    ...components,
  }
}

