import { H1 } from "@/components/typography/h1"
import { H2 } from "@/components/typography/h2"
import { H3 } from "@/components/typography/h3"
import { P } from "@/components/typography/p"
import { UL } from "@/components/typography/ul"
import { LI } from "@/components/typography/li"
import { A } from "@/components/typography/a"
import { Blockquote } from "@/components/typography/blockquote"
import { Code } from "@/components/typography/code"
import { Figure } from "@/components/typography/figure"
import { Caption } from "@/components/typography/caption"

export default function PostTemplateContent() {
  return (
    <>
      <H1>Your Post Title</H1>

      <P>
        This is the introduction to your post. Write a compelling opening paragraph that hooks the reader and introduces
        the topic.
      </P>

      <H2>First Section Heading</H2>

      <P>
        This is the content of your first section. You can include <A href="#">links</A>, <Code>inline code</Code>, and
        other formatting as needed.
      </P>

      <UL>
        <LI>First item in a list</LI>
        <LI>Second item in a list</LI>
        <LI>Third item in a list</LI>
      </UL>

      <H2>Second Section Heading</H2>

      <P>
        This is the content of your second section. Continue developing your ideas and providing valuable information to
        your readers.
      </P>

      <Blockquote>
        This is a blockquote. Use it to highlight important quotes or passages from other sources.
      </Blockquote>

      <H3>A Subsection Heading</H3>

      <P>
        This is a subsection within your second main section. Use subsections to organize your content and make it more
        scannable.
      </P>

      <Figure>
        <img src="/placeholder.svg?height=400&width=600" alt="Description of your image" />
        <Caption>Figure 1: A caption for your image.</Caption>
      </Figure>

      <H2>Conclusion</H2>

      <P>
        Summarize the key points of your post and provide a thoughtful conclusion. You might want to include a call to
        action or suggestions for further reading.
      </P>
    </>
  )
}

