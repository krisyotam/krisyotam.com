import type React from "react"
import * as Typography from "@/components/typography"
import { ScriptTagger } from "@/components/script-tagger"

// Define the types for our JSON content structure
export type ContentBlockType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "a"
  | "blockquote"
  | "ul"
  | "ol"
  | "li"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "hr"
  | "callout"
  | "snippet"
  | "figure"
  | "caption"
  | "footnotes"
  | "ref"
  | "footnote"
  | "table"
  | "image"
  | "div"

// Define the base content block interface
export interface BaseContentBlock {
  type: ContentBlockType
  id?: string
  props?: {
    className?: string
    startArticle?: boolean
    [key: string]: string | boolean | undefined
  }
  tagTerms?: boolean
}

// Define specific content block types
export interface TextContentBlock extends BaseContentBlock {
  content: string
}

export interface LinkContentBlock extends BaseContentBlock {
  type: "a"
  content: string
  href: string
}

export interface ListContentBlock extends BaseContentBlock {
  type: "ul" | "ol"
  items: (string | ContentBlock)[]
}

export interface ListItemContentBlock extends BaseContentBlock {
  type: "li"
  content: string | ContentBlock[]
}

export interface CodeContentBlock extends BaseContentBlock {
  type: "code" | "snippet"
  content: string
  language?: string
}

export interface CalloutContentBlock extends BaseContentBlock {
  type: "callout"
  content: string
  variant?: "default" | "info" | "warning" | "error"
}

export interface FigureContentBlock extends BaseContentBlock {
  type: "figure"
  src: string
  alt: string
  caption?: string
}

export interface TableContentBlock extends BaseContentBlock {
  type: "table"
  headers: string[]
  rows: string[][]
}

export interface FootnotesContentBlock extends BaseContentBlock {
  type: "footnotes"
  notes: { id: string; content: string }[]
}

export interface RefContentBlock extends BaseContentBlock {
  type: "ref"
  id: string
}

export interface DivContentBlock extends BaseContentBlock {
  type: "div"
  children: ContentBlock[]
  className?: string
}

// Union type for all content block types
export type ContentBlock =
  | TextContentBlock
  | LinkContentBlock
  | ListContentBlock
  | ListItemContentBlock
  | CodeContentBlock
  | CalloutContentBlock
  | FigureContentBlock
  | TableContentBlock
  | FootnotesContentBlock
  | RefContentBlock
  | DivContentBlock

// Component to render a content block based on its type
export const ContentBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  if (block.type.startsWith("h") && block.props?.id) {
    console.log(`Rendering heading with ID: ${block.props.id}`)
  }

  // Wrap paragraphs in articles when appropriate
  if (block.type === "p" && block.props?.startArticle) {
    return (
      <article className="paragraph-article">
        <Typography.P {...block.props}>
          {(block as TextContentBlock).tagTerms ? (
            <ScriptTagger>{(block as TextContentBlock).content}</ScriptTagger>
          ) : (
            (block as TextContentBlock).content
          )}
        </Typography.P>
      </article>
    )
  }

  switch (block.type) {
    case "h1":
      return (
        <Typography.H1 id={block.props?.id} {...block.props}>
          {(block as TextContentBlock).content}
        </Typography.H1>
      )

    case "h2":
      return (
        <Typography.H2 id={block.props?.id} {...block.props}>
          {(block as TextContentBlock).content}
        </Typography.H2>
      )

    case "h3":
      return (
        <Typography.H3 id={block.props?.id} {...block.props}>
          {(block as TextContentBlock).content}
        </Typography.H3>
      )

    case "h4":
      return (
        <Typography.H4 id={block.props?.id} {...block.props}>
          {(block as TextContentBlock).content}
        </Typography.H4>
      )

    case "p":
      const pBlock = block as TextContentBlock
      return pBlock.tagTerms ? (
        <Typography.P {...pBlock.props}>
          <ScriptTagger>{pBlock.content}</ScriptTagger>
        </Typography.P>
      ) : (
        <Typography.P {...pBlock.props}>{pBlock.content}</Typography.P>
      )

    case "a":
      const aBlock = block as LinkContentBlock
      return (
        <Typography.A href={aBlock.href} {...aBlock.props}>
          {aBlock.content}
        </Typography.A>
      )

    case "blockquote":
      return <Typography.Blockquote {...block.props}>{(block as TextContentBlock).content}</Typography.Blockquote>

    case "ul":
      const ulBlock = block as ListContentBlock
      return (
        <Typography.UL {...ulBlock.props}>
          {ulBlock.items.map((item, index) => {
            if (typeof item === "string") {
              return <Typography.LI key={index}>{item}</Typography.LI>
            } else {
              return <ContentBlock key={index} block={item} />
            }
          })}
        </Typography.UL>
      )

    case "ol":
      const olBlock = block as ListContentBlock
      return (
        <Typography.OL {...olBlock.props}>
          {olBlock.items.map((item, index) => {
            if (typeof item === "string") {
              return <Typography.LI key={index}>{item}</Typography.LI>
            } else {
              return <ContentBlock key={index} block={item} />
            }
          })}
        </Typography.OL>
      )

    case "li":
      const liBlock = block as ListItemContentBlock
      if (typeof liBlock.content === "string") {
        return <Typography.LI {...liBlock.props}>{liBlock.content}</Typography.LI>
      } else {
        return (
          <Typography.LI {...liBlock.props}>
            {liBlock.content.map((child, index) => (
              <ContentBlock key={index} block={child} />
            ))}
          </Typography.LI>
        )
      }

    case "code":
      return <Typography.Code {...block.props}>{(block as CodeContentBlock).content}</Typography.Code>

    case "lead":
      return <Typography.Lead {...block.props}>{(block as TextContentBlock).content}</Typography.Lead>

    case "large":
      return <Typography.Large {...block.props}>{(block as TextContentBlock).content}</Typography.Large>

    case "small":
      return <Typography.Small {...block.props}>{(block as TextContentBlock).content}</Typography.Small>

    case "muted":
      return <Typography.Muted {...block.props}>{(block as TextContentBlock).content}</Typography.Muted>

    case "hr":
      return <Typography.HR />

    case "callout":
      const calloutBlock = block as CalloutContentBlock
      return (
        <Typography.Callout>
          {calloutBlock.content}
        </Typography.Callout>
      )

    case "snippet":
      return <Typography.Snippet {...block.props}>{(block as CodeContentBlock).content}</Typography.Snippet>

    case "figure":
      const figureBlock = block as FigureContentBlock
      return (
        <Typography.Figure {...figureBlock.props}>
          <img src={figureBlock.src || "/placeholder.svg"} alt={figureBlock.alt} />
          {figureBlock.caption && <Typography.Caption>{figureBlock.caption}</Typography.Caption>}
        </Typography.Figure>
      )

    case "caption":
      return <Typography.Caption {...block.props}>{(block as TextContentBlock).content}</Typography.Caption>

    case "footnotes":
      const footnotesBlock = block as FootnotesContentBlock
      return (
        <Typography.FootNotes {...footnotesBlock.props}>
          {footnotesBlock.notes.map((note) => (
            <Typography.FootNote key={note.id} id={note.id}>
              {note.content}
            </Typography.FootNote>
          ))}
        </Typography.FootNotes>
      )

    case "ref":
      return <Typography.Ref id={(block as RefContentBlock).id} {...block.props} />

    case "footnote":
      return (
        <Typography.FootNote id={block.id}>
          {(block as TextContentBlock).content}
        </Typography.FootNote>
      )

    case "table":
      const tableBlock = block as TableContentBlock
      return (
        <table className="w-full border-collapse my-6" {...tableBlock.props}>
          <thead>
            <tr>
              {tableBlock.headers.map((header, index) => (
                <th key={index} className="border border-border p-2 bg-muted text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableBlock.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-border p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )

    case "image":
      const imgBlock = block as unknown as FigureContentBlock
      return (
        <img
          src={imgBlock.src || "/placeholder.svg"}
          alt={imgBlock.alt}
          className="max-w-full my-4"
          {...imgBlock.props}
        />
      )

    case "div":
      const divBlock = block as DivContentBlock
      return (
        <div className={divBlock.className} {...divBlock.props}>
          {divBlock.children.map((child, index) => (
            <ContentBlock key={index} block={child} />
          ))}
        </div>
      )

    default:
      console.warn(`Unknown block type: ${block.type}`)
      return null
  }
}

// Main component that renders a list of content blocks
export const PostMap: React.FC<{ content: ContentBlock[] }> = ({ content }) => {
  // Group content into semantic sections
  const groupedContent: React.ReactNode[] = []
  let currentSection: React.ReactNode[] = []
  let sectionTitle = ""

  content.forEach((block, index) => {
    // Start a new section when encountering an h2
    if (block.type === "h2") {
      // Add the previous section if it exists
      if (currentSection.length > 0) {
        groupedContent.push(
          <section key={`section-${sectionTitle || index}`} className="content-section">
            {currentSection}
          </section>,
        )
      }

      // Start a new section
      sectionTitle = (block as TextContentBlock).content
      currentSection = [<ContentBlock key={`block-${index}`} block={block} />]
    } else {
      // Add to the current section
      currentSection.push(<ContentBlock key={`block-${index}`} block={block} />)
    }
  })

  // Add the last section
  if (currentSection.length > 0) {
    groupedContent.push(
      <section key={`section-${sectionTitle || "last"}`} className="content-section">
        {currentSection}
      </section>,
    )
  }

  return <>{groupedContent}</>
}

export default PostMap

