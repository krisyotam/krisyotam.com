"use client"

import { MarginCard } from "@/components/margin-card"
import { TableOfContents } from "@/components/table-of-contents"
import { Bibliography } from "@/components/bibliography"
import { RelatedPosts } from "@/components/related-posts"
import { PostMap, type ContentBlock } from "@/components/post-map"

// Define headings for the table of contents
const headings = [
  {
    id: "example-post",
    text: "Example Post",
    level: 1,
    children: [],
  },
  {
    id: "introduction",
    text: "Introduction",
    level: 2,
    children: [],
  },
  {
    id: "typography-examples",
    text: "Typography Examples",
    level: 2,
    children: [
      {
        id: "headings",
        text: "Headings",
        level: 3,
        children: [],
      },
      {
        id: "paragraphs",
        text: "Paragraphs",
        level: 3,
        children: [],
      },
      {
        id: "lists",
        text: "Lists",
        level: 3,
        children: [],
      },
    ],
  },
  {
    id: "advanced-elements",
    text: "Advanced Elements",
    level: 2,
    children: [
      {
        id: "code-blocks",
        text: "Code Blocks",
        level: 3,
        children: [],
      },
      {
        id: "tables",
        text: "Tables",
        level: 3,
        children: [],
      },
      {
        id: "figures",
        text: "Figures",
        level: 3,
        children: [],
      },
    ],
  },
  {
    id: "conclusion",
    text: "Conclusion",
    level: 2,
    children: [],
  },
]

// Define bibliography entries
const bibliographyEntries = [
  {
    id: "1",
    author: "John Doe",
    title: "Example Reference",
    year: 2023,
    publisher: "Example Publisher",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "article",
  },
  {
    id: "2",
    author: "Jane Smith",
    title: "Artificial Intelligence: A Modern Approach",
    year: 2021,
    publisher: "Academic Press",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "book",
  },
  {
    id: "3",
    author: "Alex Johnson",
    title: "The Future of Space Exploration",
    year: 2022,
    publisher: "Science Today",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "article",
  },
]

// Define margin notes
const marginNotes = [
  {
    id: "note-1",
    title: "About Typography",
    content:
      "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
    index: 1,
  },
  {
    id: "note-2",
    title: "Markdown",
    content:
      "Markdown is a lightweight markup language with plain text formatting syntax designed to be converted to HTML and many other formats.",
    index: 2,
  },
  {
    id: "note-3",
    title: "JSON Structure",
    content:
      "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.",
    index: 3,
  },
  {
    id: "note-4",
    title: "React Components",
    content:
      "React components are reusable pieces of code that return React elements describing what should appear on the screen.",
    index: 4,
  },
  {
    id: "note-5",
    title: "Footnotes",
    content: "Footnotes provide additional information or citations at the bottom of a page or document.",
    index: 5,
  },
]

// Define the blog post content as JSON
const postContent: ContentBlock[] = [
  {
    type: "h1",
    content: "Example Post",
    props: { id: "example-post" },
  },
  {
    type: "lead",
    content:
      "This is a comprehensive example post that demonstrates all the available content types and formatting options in our JSON-based blog system.",
  },
  {
    type: "h2",
    content: "Introduction",
    props: { id: "introduction" },
  },
  {
    type: "p",
    content:
      "This post showcases how to use our JSON-based content structure to create rich, interactive blog posts. The content is defined as a structured JSON object that maps to various Typography components. This paragraph contains the term Artificial Intelligence which should be tagged by our script.",
    tagTerms: true,
  },
  {
    type: "p",
    content: "Using a JSON structure for content has several advantages:",
    tagTerms: true,
  },
  {
    type: "ul",
    items: [
      "Clear separation between content and presentation",
      "Easier to store in databases or CMS systems",
      "Simpler to generate programmatically",
      "More maintainable and easier to update",
    ],
  },
  {
    type: "h2",
    content: "Typography Examples",
    props: { id: "typography-examples" },
  },
  {
    type: "h3",
    content: "Headings",
    props: { id: "headings" },
  },
  {
    type: "p",
    content: "Our system supports multiple heading levels (H1-H4) to structure your content hierarchically.",
  },
  {
    type: "h4",
    content: "This is an H4 Heading",
  },
  {
    type: "h3",
    content: "Paragraphs",
    props: { id: "paragraphs" },
  },
  {
    type: "p",
    content: "Regular paragraphs are the most common content type. You can also use specialized paragraph styles:",
  },
  {
    type: "lead",
    content: "This is a lead paragraph, typically used at the beginning of an article to introduce the topic.",
  },
  {
    type: "large",
    content: "This is a large paragraph, used for emphasizing important information.",
  },
  {
    type: "small",
    content: "This is a small paragraph, used for less important information or notes.",
  },
  {
    type: "muted",
    content: "This is a muted paragraph, used for secondary information.",
  },
  {
    type: "blockquote",
    content:
      "This is a blockquote. It's used to highlight quotes or important passages from the text. Space Exploration is another term that should be tagged in this blockquote.",
    tagTerms: true,
  },
  {
    type: "h3",
    content: "Lists",
    props: { id: "lists" },
  },
  {
    type: "p",
    content: "You can create both unordered (bullet) and ordered (numbered) lists:",
  },
  {
    type: "h4",
    content: "Unordered List",
  },
  {
    type: "ul",
    items: [
      "First item",
      "Second item",
      "Third item with nested list",
      {
        type: "li",
        content: [
          {
            type: "p",
            content: "Item with a paragraph",
          },
          {
            type: "ul",
            items: ["Nested item 1", "Nested item 2"],
          },
        ],
      },
    ],
  },
  {
    type: "h4",
    content: "Ordered List",
  },
  {
    type: "ol",
    items: ["First item", "Second item", "Third item"],
  },
  {
    type: "h2",
    content: "Advanced Elements",
    props: { id: "advanced-elements" },
  },
  {
    type: "h3",
    content: "Code Blocks",
    props: { id: "code-blocks" },
  },
  {
    type: "p",
    content: "You can include code snippets and blocks:",
  },
  {
    type: "p",
    content: "Inline code can be included like this: `const example = 'Hello World';`",
  },
  {
    type: "code",
    content: `function example() {
  console.log("Hello, world!");
  return true;
}`,
  },
  {
    type: "snippet",
    content: `// This is a code snippet
import React from 'react';

const Component = () => {
  return <div>Hello World</div>;
};

export default Component;`,
  },
  {
    type: "h3",
    content: "Tables",
    props: { id: "tables" },
  },
  {
    type: "p",
    content: "Tables are useful for presenting structured data:",
  },
  {
    type: "table",
    headers: ["Name", "Type", "Description"],
    rows: [
      ["h1-h4", "Typography", "Heading components of different levels"],
      ["p", "Typography", "Regular paragraph component"],
      ["ul/ol", "Typography", "Unordered and ordered list components"],
      ["code", "Typography", "Code block component"],
      ["table", "HTML", "HTML table for structured data"],
    ],
  },
  {
    type: "h3",
    content: "Figures",
    props: { id: "figures" },
  },
  {
    type: "p",
    content: "Figures can be used to include images with captions:",
  },
  {
    type: "figure",
    src: "/placeholder.svg?height=300&width=500",
    alt: "Example figure",
    caption: "Figure 1: An example figure with a caption",
  },
  {
    type: "h3",
    content: "Callouts",
    props: { id: "callouts" },
  },
  {
    type: "callout",
    content: "This is a default callout. It's used to highlight important information.",
    variant: "default",
  },
  {
    type: "callout",
    content: "This is an info callout. It provides additional information to the reader.",
    variant: "info",
  },
  {
    type: "callout",
    content: "This is a warning callout. It warns the reader about potential issues.",
    variant: "warning",
  },
  {
    type: "h3",
    content: "Footnotes",
    props: { id: "footnotes" },
  },
  {
    type: "p",
    content:
      "You can add footnotes to your content for references or additional information. Here's an example with a footnote reference.",
  },
  {
    type: "p",
    content: "This sentence has a footnote reference at the end.",
  },
  {
    type: "ref",
    id: "footnote-1",
  },
  {
    type: "p",
    content: "And here's another sentence with a different footnote.",
  },
  {
    type: "ref",
    id: "footnote-2",
  },
  {
    type: "footnotes",
    notes: [
      {
        id: "footnote-1",
        content:
          "This is the content of the first footnote. It provides additional information about the referenced text.",
      },
      {
        id: "footnote-2",
        content:
          "This is the content of the second footnote. Quantum Computing is a term that should be tagged in this footnote.",
        tagTerms: true,
      },
    ],
  },
  {
    type: "hr",
  },
  {
    type: "h2",
    content: "Conclusion",
    props: { id: "conclusion" },
  },
  {
    type: "p",
    content:
      "This post has demonstrated all the available content types and formatting options in our JSON-based blog system. You can use this as a reference when creating your own blog posts.",
    tagTerms: true,
  },
  {
    type: "p",
    content:
      "The JSON structure makes it easy to add new content types and modify existing ones without changing the underlying rendering logic.",
  },
]

// Extract all text content for related posts matching
const extractTextContent = (blocks: ContentBlock[]): string => {
  return blocks
    .map((block) => {
      if ("content" in block && typeof block.content === "string") {
        return block.content
      } else if (block.type === "ul" || block.type === "ol") {
        const listBlock = block as any
        return listBlock.items.map((item) => (typeof item === "string" ? item : "")).join(" ")
      } else if (block.type === "table") {
        const tableBlock = block as any
        return [...tableBlock.headers, ...tableBlock.rows.flat()].join(" ")
      }
      return ""
    })
    .join(" ")
}

export default function ExamplePostContent() {
  // Extract text content for related posts matching
  const textContent = extractTextContent(postContent)

  return (
    <div className="relative">
      {/* Main content */}
      <div className="relative z-10">
        {/* Render content using PostMap component */}
        <PostMap content={postContent} />

        {/* Bibliography - This will be handled by the layout if you pass the data */}
        <div className="my-8">
          <Bibliography bibliography={bibliographyEntries} />
        </div>

        {/* Related Posts - Automatically finds related content */}
        <RelatedPosts content={textContent} />
      </div>

      {/* 
        SIDEBAR POSITIONING
        Copy this section to any blog post to position the Table of Contents and Margin Notes
      */}
      <>
        {/* Table of Contents - Left Sidebar */}
        <div className="hidden md:block absolute left-[-250px] top-0 w-[220px]">
          <div className="sticky top-8">
            <TableOfContents headings={headings} />
          </div>
        </div>

        {/* Margin Notes - Right Sidebar */}
        <div className="hidden md:block absolute right-[-250px] top-0 w-[220px]">
          <div className="sticky top-8 space-y-4 pb-24">
            {marginNotes.map((note) => (
              <div key={note.id} className="mb-4">
                <MarginCard note={note} />
              </div>
            ))}
          </div>
        </div>
      </>
      {/* END SIDEBAR POSITIONING */}
    </div>
  )
}

