import type { MDXComponents } from "mdx/types"
import React from "react"
import Image, { type ImageProps } from "next/image"
import * as Typography from "@/components/typography"
import { Spoiler } from "spoiled"
import { InternalLink } from "@/components/internal-link"
import SimpleBib from "@/components/simplebib"
import { EnhancedLink } from "@/components/enhanced-link"
import { CodeBlock } from "@/components/ui/code-block"
import Books from "@/components/posts/books/books"
import Cinema from "@/components/posts/books/cinema"
import { Tweet } from "@/components/typography/tweet"
import dynamic from 'next/dynamic'
import { Pfp } from "@/components/typography/pfp"
import Redacted from "@/components/typography/redacted"
import DateComponent from "@/components/time-stamp"
// Import TikZ with no SSR to avoid hydration issues
const TikZ = dynamic(() => import('@/components/typography/tikz'), { ssr: false })

// Import all post-related components
import MiniBio from '@/components/posts/people/mini-bio'
import Dropcap from '@/components/dropcap'
import Bible from "@/components/references/christianity/1611bible"
import LinkTags from "@/components/link-tags"
import { Box } from "@/components/posts/typography/box"
import { Column, ColumnContainer } from "@/components/posts/typography/column"
import NameBreakdown from '@/components/name-breakdown'
import { Age } from "@/components/posts/typography/age"
import { Excerpt } from "@/components/posts/typography/excerpt"
import { Quote } from "@/components/posts/typography/quote"
import Define from "@/components/references/language/oed"
import { PoemBox } from "@/components/posts/typography/poem"
import Collapse from "@/components/posts/typography/collapse"
import FileViewer from "@/components/posts/typography/file-viewer"
import Essay from "@/components/posts/typography/essay"
import Notice from "@/components/posts/typography/notice"
import OcCharacterDisplay from "@/components/posts/characters/oc-character-display"
import CharacterDisplay from "@/components/posts/characters/character-display"
import Inflation from "@/components/inflation"
import { EnhancedImageDisplay } from "@/components/posts/images/enhanced-image-display"
import { Image as BasicImage } from "@/components/posts/images/basic-image-display"
import { Video as BasicVideo } from "@/components/posts/images/basic-video"
import { EnhancedVideoDisplay } from "@/components/posts/images/enhanced-video-display"
import TryHackMe from "@/components/posts/ctfs/tryhackme"
import Book from "@/components/posts/books/book"
import { BookCard } from "@/components/posts/books/book-card"
import AnimeDisplay from "@/components/posts/content/anime-display"
import MangaDisplay from "@/components/posts/content/manga-display"
import MovieDisplay from "@/components/posts/content/movie-display"
import Movie from "@/components/posts/media/movie"
import HauteCouture from "@/components/posts/fashion/haute-couture"
import PoemDisplay from "@/components/posts/poetry/poem-display"
import HauteCoutureCollection from "@/components/posts/fashion/haute-couture-collection"
import MangaPanelDisplay from "@/components/posts/content/manga-panel-display"
import MangaPanelDisplayCollection from "@/components/posts/content/manga-panel-display-collection"
import Chateau from "@/components/posts/architecture/chateau"
import ChateauCollection from "@/components/posts/architecture/chateau-collection"
import Human from "@/components/posts/basic/human"
import Company from "@/components/posts/basic/company"
import { QuotesFeed } from "@/components/quotes-feed"; // Add this import
import { Tree } from "@/components/family-tree"
import WebsiteDemo from "@/components/posts/website/website"
import { WikiPerson } from "@/components/posts/wikipedia/wiki-person"
import { WikiFilm } from "@/components/posts/wikipedia/wiki-film"
import Product from "@/components/posts/basic/product"
import { RedditEmbed } from "@/components/typography/reddit-embed"
import AnimeCharacterDisplay from "@/components/posts/content/anime-character-display"
import { Art7x4 } from "@/components/posts/art/art-7x4"
import RatingDisplay from "@/components/posts/content/rating"
import Paper from "@/components/typography/paper"
import { WebsitePreview } from "@/components/website-preview"
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
    table: ({ children }) => <table className="w-full border-collapse my-6" data-mdx-table="true">{children}</table>,
    
    // Handle code blocks with proper styling
    pre: ({ children, className }) => {
      // Check if this is a code block with language
      if (React.isValidElement(children) && 
          children.props?.className && 
          children.props.className.startsWith('language-')) {
        
        // Extract language from className (e.g., "language-javascript" -> "javascript")
        let language = children.props.className.replace('language-', '');
        
        // Extract filename if present in format ```lang(filename.ext)
        let filename = null;
        const filenameMatch = language.match(/^(.+?)\((.+?)\)$/);
        if (filenameMatch) {
          language = filenameMatch[1]; // Get the language part
          filename = filenameMatch[2]; // Get the filename part
        }
        
        // Use CodeBlock for syntax highlighting with wrapper for proper styling
        return (
          <div className="code-block-wrapper">
            <CodeBlock language={language} filename={filename}>{children}</CodeBlock>
          </div>
        );
      }
      
      // Default styling for pre that matches Box component
      return (
        <pre className="p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] font-mono text-sm overflow-x-auto">
          {children}
        </pre>
      );
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

    // Custom image component - use regular img for external URLs since we can't know dimensions
    img: (props) => (
      <div className="my-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={props.src}
          alt={props.alt || ""}
          style={{ width: "100%", height: "auto", maxWidth: "100%", margin: "0 auto" }}
          loading="lazy"
        />
        {props.title && <Typography.Caption>{props.title}</Typography.Caption>}
      </div>
    ),

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
    LinkTags,
    Paper,
    Pfp,
    Redacted,
    
    // Typography components
    Lead: Typography.Lead,
    Large: Typography.Large,
    Small: Typography.Small,
    Muted: Typography.Muted,
    
    // Text formatting and layout components
    InternalLink,
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
    // Character and people components
    OcCharacterDisplay,
    CharacterDisplay,
    Human,
    Company,
    Tree,
    WikiPerson,
    WikiFilm,
    
    // Product components
    Product,
    
    // Images and media components
    EnhancedImageDisplay,
    BasicImage,
    BasicVideo,
    EnhancedVideoDisplay,
    
    // Books and reading components
    BookCard,
    // Content display components
    AnimeCharacterDisplay,
    MovieDisplay,
    Movie,
    MangaPanelDisplay,
    MangaPanelDisplayCollection,
    PoemDisplay,
    
    // Fashion and architecture components
    HauteCouture,
    HauteCoutureCollection,
    Chateau,
    ChateauCollection,
    
    // Code components
    CodeBlock,
    
    // Special content components
    TryHackMe,
      // Website embedding component
    WebsiteDemo,
      // Art components
    Art7x4,
    
    // Rating components
    RatingDisplay,

    // Custom quotes feed component
    QuotesFeed, // Add this component
    
    // Website components
    WebsitePreview,

    // Math component for LaTeX
    Math,

    // Pass through any provided components (for overrides)
    ...components,
  }
}

