import * as Typography from "@/components/typography"
import { Art7x4 } from "@/components/posts/art/art-7x4"

export default function StarryNightContent() {
  // Artwork information for The Starry Night
  const starryNight = {
    id: "starry-night",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    period: "Post-Impressionism",
    type: "Landscape",
    medium: "Oil on canvas",
    dimensions: "73.7 cm × 92.1 cm (29.0 in × 36.3 in)",
    location: "Museum of Modern Art, New York City",
    imageUrl:
      "https://i.ibb.co/ZpBvRTPb/r44d0f4o4xj91-1.webp",
    description: "One of van Gogh's most famous works, painted during his stay at the asylum of Saint-Paul-de-Mausole.",
  }

  return (
    <>
      <Art7x4 artwork={starryNight} className="mb-6" />


      <Typography.Lead>
        Vincent van Gogh's <Typography.Code>The Starry Night</Typography.Code> is one of the most iconic paintings in
        the history of Western art. Created in 1889, during a tumultuous period in the artist's life, it encapsulates
        van Gogh's complex emotional state and his unique artistic vision. The swirling skies, radiant stars, and
        tranquil village form a breathtaking composition that has captivated viewers for over a century.
      </Typography.Lead>

      <Typography.H2>
        The Background of <Typography.Code>The Starry Night</Typography.Code>
      </Typography.H2>

      <Typography.P>
        Van Gogh painted <Typography.Code>The Starry Night</Typography.Code> while he was staying at the
        Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence, France. This period was marked by intense personal
        struggles, including his mental health issues and feelings of isolation. Despite these challenges, it was also a
        time of remarkable creativity for van Gogh. He was deeply affected by his surroundings, drawing inspiration from
        the views outside his window, as well as his internal emotional landscape.
      </Typography.P>

      <Typography.P>
        As van Gogh wrote in a letter to his brother, Theo,{" "}
        <Typography.Code>
          "For my part, I'm alone, and I have no wish to make anyone else share my troubles."
        </Typography.Code>
        This statement reflects both the artist's sense of seclusion and his determination to create meaningful work,
        even in the midst of despair.
      </Typography.P>

      <Typography.H2>The Artistic Vision Behind the Painting</Typography.H2>

      <Typography.P>
        <Typography.Code>The Starry Night</Typography.Code> is not merely a representation of the night sky; it is a
        reflection of van Gogh's inner turmoil, dreams, and spiritual yearnings. The swirling forms and bold
        brushstrokes evoke a sense of movement and intensity, mirroring the artist's emotional state. The stars,
        exaggerated in their size and brightness, appear almost alive, casting an ethereal glow over the landscape.
      </Typography.P>

      <Typography.P>
        Van Gogh's use of color is also significant in conveying mood. The deep blues and vibrant yellows create a
        striking contrast that intensifies the painting's emotional impact. According to art historian H. W. Janson,
        "Van Gogh sought to make the night sky an expression of his own emotional experience, rather than a literal
        portrayal." The exaggerated curvature of the sky, with its spiraling clouds, conveys a sense of turbulence that
        is both personal and universal.
      </Typography.P>

      <Typography.Blockquote>
        I have tried to express the terrible energies of the night. The stars are shining, but the night itself is
        menacing, and I hope to convey that.
      </Typography.Blockquote>

      <Typography.P>This tension between beauty and chaos is central to the painting's allure.</Typography.P>

      <Typography.H2>The Influence of Van Gogh's Mental State</Typography.H2>

      <Typography.P>
        Van Gogh's mental health struggles play a crucial role in understanding the emotional depth of{" "}
        <Typography.Code>The Starry Night</Typography.Code>. At the time he painted it, he was experiencing periods of
        intense emotional crises, including hallucinations and depression. Some scholars have suggested that the
        swirling patterns in the sky represent van Gogh's struggle with his own perception of reality.
      </Typography.P>

      <Typography.P>
        Dr. Sidney M. Smith, a prominent art psychologist, stated, "The swirling patterns that characterize{" "}
        <Typography.Code>The Starry Night</Typography.Code> are often interpreted as a visual representation of van
        Gogh's inner turbulence. They reflect his psychological state, creating a vivid expression of his turmoil and
        search for meaning." This view suggests that van Gogh's art was a way of grappling with his personal demons,
        using the canvas as an outlet for his emotional release.
      </Typography.P>

      <Typography.H2>The Symbolism of the Cypress Tree</Typography.H2>

      <Typography.P>
        One of the most striking elements of <Typography.Code>The Starry Night</Typography.Code> is the large cypress
        tree that stretches upward in the foreground. This tree, often associated with death and mourning, creates a
        sharp contrast with the luminous stars above. While its symbolism may be linked to van Gogh's struggles with
        depression, the cypress also serves as a bridge between the earthly and the celestial.
      </Typography.P>

      <Typography.Figure>
        <img src="/placeholder.svg?height=400&width=600" alt="Close-up of the cypress tree in The Starry Night" />
        <Typography.Caption>
          Figure 1: The cypress tree in The Starry Night, often interpreted as a symbol connecting earth and sky.
        </Typography.Caption>
      </Typography.Figure>

      <Typography.P>
        Some scholars suggest that the cypress tree may also symbolize the artist's yearning for a connection with the
        divine or the infinite. Van Gogh himself noted in his letters that he saw trees as representations of life and
        death,{" "}
        <Typography.Code>
          "There is something melancholy in their appearance, but it is also a symbol of immortality."
        </Typography.Code>
        The tree's dark silhouette against the glowing night sky is a poignant reminder of the tension between life and
        death, despair and hope.
      </Typography.P>

      <Typography.H2>
        The Legacy of <Typography.Code>The Starry Night</Typography.Code>
      </Typography.H2>

      <Typography.P>
        Today, <Typography.Code>The Starry Night</Typography.Code> is housed in the Museum of Modern Art in New York
        City, where it continues to inspire awe in millions of visitors each year. Its unique combination of emotional
        depth, technical mastery, and visionary expression has cemented its place as a cornerstone of modern art.
      </Typography.P>

      <Typography.Callout
        emoji="🔍"
        text="The painting measures 73.7 cm × 92.1 cm (29.0 in × 36.3 in) and was created using oil on canvas, showcasing van Gogh's distinctive brushwork technique."
      />

      <Typography.P>
        In his lifetime, van Gogh sold only a few paintings, and his works were largely unrecognized during his career.
        However, <Typography.Code>The Starry Night</Typography.Code> would later become a symbol of van Gogh's genius
        and his enduring impact on the world of art. As the art critic Robert Hughes once remarked,{" "}
        <Typography.Code>
          "Van Gogh was the first artist to make visible what we now understand as the emotional life of a painting."
        </Typography.Code>
      </Typography.P>

      <Typography.H2>Conclusion</Typography.H2>

      <Typography.P>
        Vincent van Gogh's <Typography.Code>The Starry Night</Typography.Code> is more than just a depiction of the
        night sky; it is an emotional and spiritual journey that reflects the artist's inner world. Through his
        innovative use of color, brushwork, and symbolism, van Gogh created a timeless masterpiece that speaks to the
        complexities of the human experience.
        <Typography.Code>The Starry Night</Typography.Code> remains a powerful testament to the resilience of the human
        spirit, an expression of both beauty and struggle that continues to resonate with audiences around the globe.
      </Typography.P>

      <Typography.FootNotes>
        <Typography.FootNote id="1">
          Van Gogh created The Starry Night in June 1889, just a year before his death in July 1890.
        </Typography.FootNote>
        <Typography.FootNote id="2">
          The view depicted in the painting is from his asylum room at Saint-Rémy-de-Provence, though the village was
          added from his imagination.
        </Typography.FootNote>
      </Typography.FootNotes>
    </>
  )
}

