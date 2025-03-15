"use client"

import { MarginCard } from "@/components/margin-card"
import TableOfContents from "@/components/table-of-contents";
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

// Update the bibliography entries in the demo post to include more entries for testing pagination

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
  {
    id: "4",
    author: "Maria Garcia",
    title: "Quantum Computing: Principles and Practice",
    year: 2023,
    publisher: "Tech Publications",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "book",
  },
  {
    id: "5",
    author: "David Lee",
    title: "Neural Networks and Deep Learning",
    year: 2022,
    publisher: "AI Research Press",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "book",
  },
  {
    id: "6",
    author: "Sarah Wilson",
    title: "The Ethics of Artificial Intelligence",
    year: 2023,
    publisher: "Philosophy Today",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "article",
  },
  {
    id: "7",
    author: "Michael Brown",
    title: "Understanding Machine Learning",
    year: 2022,
    publisher: "Tech Education Press",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "book",
  },
  {
    id: "8",
    author: "Emily White",
    title: "The Future of Human-AI Interaction",
    year: 2023,
    publisher: "Digital Horizons",
    url: "https://www.orimi.com/pdf-test.pdf",
    type: "article",
  },
]

// Update margin notes with a long example
const marginNotes = [
  {
    id: "note-1",
    title: "About Typography",
    content:
      "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
    index: 1,
    source: "The Elements of Typographic Style",
  },
  {
    id: "note-2",
    title: "Artificial Intelligence Overview",
    content:
      "Artificial Intelligence represents a fundamental shift in how computers process and interact with information. Modern AI systems, particularly those based on deep learning and neural networks, can recognize patterns, understand natural language, and even generate human-like responses. This technological advancement has implications across numerous fields, from healthcare and scientific research to everyday applications like virtual assistants and recommendation systems. The development of AI raises important questions about automation, ethics, and the future role of human intelligence in an increasingly computerized world. As these systems become more sophisticated, we must carefully consider both their potential benefits and risks to society.",
    index: 2,
    source: "The Cambridge Handbook of Artificial Intelligence",
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

// Update content to include startArticle property for paragraphs and add more keywords
const postContent: ContentBlock[] = [
  {
    type: "h1",
    content: "Example Post",
    props: { id: "example-post" },
  },
  {
    type: "lead",
    content:
      "This is a comprehensive example post that demonstrates all the available content types and formatting options in our JSON-based blog system[1]. It touches on topics like artificial intelligence, space exploration, and quantum computing.",
    tagTerms: true,
    props: { startArticle: true }, // Mark as start of an article
  },
  {
    type: "h2",
    content: "Introduction",
    props: { id: "introduction" },
  },
  {
    type: "p",
    content:
      "This post showcases how to use our JSON-based content structure to create rich, interactive blog posts. Modern Artificial Intelligence systems have revolutionized how we process and understand content. The content is defined as a structured JSON object that maps to various Typography components.",
    tagTerms: true,
    props: { startArticle: true }, // Mark as start of an article
  },
  {
    type: "p",
    content:
      "This paragraph contains the term Artificial Intelligence which should be tagged by our script. We also discuss topics related to blockchain technology and sustainable technology approaches in modern computing.",
    tagTerms: true,
  },
  {
    type: "p",
    content:
      "Using a JSON structure for content has several advantages, especially when dealing with programming languages and software development:",
    tagTerms: true,
  },
  {
    type: "ul",
    items: [
      "Clear separation between content and presentation",
      "Easier to store in databases or CMS systems",
      "Simpler to generate programmatically",
      "More maintainable and easier to update",
      "Better integration with modern web development practices",
    ],
  },
  {
    type: "p",
    content:
      "The evolution of programming languages has greatly influenced how we structure and process content in modern applications. This is particularly relevant when considering digital privacy concerns in today's interconnected world.",
    tagTerms: true,
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
    content:
      "Our system supports multiple heading levels (H1-H4) to structure your content hierarchically. This is essential for cognitive processing and decision making when consuming complex information.",
    tagTerms: true,
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
    content:
      "Regular paragraphs are the most common content type. You can also use specialized paragraph styles. Understanding consciousness and how we process information is key to effective communication.",
    tagTerms: true,
  },
  {
    type: "lead",
    content:
      "This is a lead paragraph, typically used at the beginning of an article to introduce the topic. The future of work is increasingly influenced by automation and AI technologies.",
    tagTerms: true,
  },
  {
    type: "large",
    content:
      "This is a large paragraph, used for emphasizing important information. Machine learning ethics are becoming increasingly important in today's technological landscape.",
    tagTerms: true,
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
      "This is a blockquote. It's used to highlight quotes or important passages from the text. Space Exploration is another term that should be tagged in this blockquote. The philosophy of time is also an interesting topic to explore in this context.",
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
    content:
      "You can include code snippets and blocks. The blockchain revolution has introduced new paradigms in coding and data structures:",
    tagTerms: true,
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
    content:
      "Tables are useful for presenting structured data. Digital privacy concerns often require careful data organization:",
    tagTerms: true,
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
    content: "Figures can be used to include images with captions. Exploring the cosmos often requires visual aids:",
    tagTerms: true,
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
    content:
      "This is a default callout. It's used to highlight important information about sustainable technology approaches.",
    variant: "default",
    tagTerms: true,
  },
  {
    type: "callout",
    content:
      "This is an info callout. It provides additional information to the reader about cognitive biases in decision making.",
    variant: "info",
    tagTerms: true,
  },
  {
    type: "callout",
    content: "This is a warning callout. It warns the reader about potential issues with machine learning ethics.",
    variant: "warning",
    tagTerms: true,
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
      "This post has demonstrated all the available content types and formatting options in our JSON-based blog system. You can use this as a reference when creating your own blog posts. The future of work will increasingly involve these types of structured content systems.",
    tagTerms: true,
  },
  {
    type: "p",
    content:
      "The JSON structure makes it easy to add new content types and modify existing ones without changing the underlying rendering logic. This approach aligns well with the evolution of programming languages and modern development practices.",
    tagTerms: true,
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

