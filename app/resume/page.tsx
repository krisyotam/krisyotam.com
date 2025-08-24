import { PageHeader } from "@/components/page-header";
import { Box } from "@/components/posts/typography/box";
import Collapse from "@/components/posts/typography/collapse";

export default function ResumePage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <PageHeader
        title="Kris Yotam — Writer for Hire"
        preview="Essayist, reviewer, and analyst. Editorials on high art: literary fiction, ballet, opera, plays, anime, manga, fine arts, and more."
        status="Active"
        confidence="certain"
        importance={9}
      />
      <section className="mt-8 space-y-8">
        <Box>
          <h2 className="text-2xl font-serif font-medium mb-2">Kris Yotam</h2>
          <p className="text-sm text-muted-foreground mb-2">Washington, D.C. · <a href="mailto:kris@example.com" className="underline">kris@example.com</a> · <a href="https://krisyotam.com" className="underline">krisyotam.com</a></p>
          <p className="text-base font-serif italic text-muted-foreground">Writer for hire. Essayist, reviewer, and analyst. Editorials on high art: literature, ballet, opera, plays, anime, manga, fine arts, and more.</p>
        </Box>

        <Box>
          <Collapse title="Editorial Focus">
            <ul className="list-none ml-0 text-sm space-y-1">
              <li>Literary fiction & criticism (<a href="/reading/books" className="underline">books</a>)</li>
              <li>Ballet, opera, and stage plays (<a href="/reading/ballet" className="underline">ballet</a>, <a href="/reading/opera" className="underline">opera</a>, <a href="/reading/plays" className="underline">plays</a>)</li>
              <li>Anime & manga analysis (<a href="/anime" className="underline">anime</a>, <a href="/manga" className="underline">manga</a>)</li>
              <li>Fine arts & visual culture (<a href="/art" className="underline">art</a>)</li>
              <li>Book, film, and art reviews (<a href="/reviews" className="underline">reviews</a>)</li>
            </ul>
          </Collapse>
        </Box>

        <Box>
          <Collapse title="Services Offered">
            <ul className="list-none ml-0 text-sm space-y-1">
              <li>Commissioned essays & editorials (<a href="/essays" className="underline">essays</a>)</li>
              <li>Reviews for publications & blogs (<a href="/blogroll" className="underline">blogroll</a>)</li>
              <li>Critical analysis & commentary (<a href="/prompts" className="underline">prompts</a>)</li>
              <li>Consulting on literary/art projects</li>
            </ul>
          </Collapse>
        </Box>

        <Box>
          <Collapse title="Selected Publications & Projects">
            <ul className="list-none ml-0 text-sm space-y-1">
              <li><a href="/essays" className="underline">Essays</a> — Editorials and longform analysis</li>
              <li><a href="/reviews" className="underline">Reviews</a> — Books, films, art, and more</li>
              <li><a href="/blogroll" className="underline">Blogroll</a> — Guest posts and collaborations</li>
              <li><a href="/prompts" className="underline">Prompts</a> — Creative and critical writing exercises</li>
              <li><a href="/art" className="underline">Art</a> — Visual and fine arts commentary</li>
            </ul>
          </Collapse>
        </Box>

        <Box>
          <Collapse title="Education & Credentials">
            <ul className="list-none ml-0 text-sm space-y-1">
              <li>B.A. Literature, Example University (2016–2020)</li>
              <li>Certificate in Art Criticism, Example Institute (2021)</li>
              <li>Ongoing independent research in literary theory, aesthetics, and cultural studies</li>
            </ul>
          </Collapse>
        </Box>

        <Box>
          <Collapse title="Contact & Availability">
            <p className="text-sm text-muted-foreground">Email: <a href="mailto:kris@example.com" className="underline">kris@example.com</a></p>
            <p className="text-sm text-muted-foreground">Available for freelance, editorial, and consulting work.</p>
          </Collapse>
        </Box>
      </section>
    </main>
  );
}
