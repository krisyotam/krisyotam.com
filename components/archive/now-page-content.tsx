"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface NowPageContentProps {
  isArchived?: boolean
}

export function NowPageContent({ isArchived = false }: NowPageContentProps) {
  return (
    <div className="space-y-12">
      {!isArchived && (
        <section className="prose dark:prose-invert max-w-none">
          <p>
            This is my{" "}
            <Link href="https://nownownow.com/about" className="underline" target="_blank" rel="noopener noreferrer">
              now page <ExternalLink className="inline h-3 w-3" />
            </Link>
            . Inspired by Derek Sivers, it's a snapshot of what I'm focused on at this point in my life. Unlike social
            media that captures moments, this page reflects my current priorities, interests, and endeavors.
          </p>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Core Focus Areas</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">My primary attention is directed toward three key areas:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Developing a comprehensive framework for interdisciplinary education</li>
            <li>Writing and publishing my next book on the philosophy of knowledge acquisition</li>
            <li>Building a digital garden to share my interconnected thoughts and research</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Current Projects</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Projects that are actively in progress:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>
              <span className="font-medium">The Symphony of Slow Knowledge</span> — Finalizing the manuscript for
              publication in late 2025
            </li>
            <li>
              <span className="font-medium">Minimalist Digital Presence</span> — Refining my personal website and
              digital footprint
            </li>
            <li>
              <span className="font-medium">Lecture Series</span> — Preparing a 12-part lecture series on the
              intersection of classical and modern educational methodologies
            </li>
            <li>
              <span className="font-medium">Research Collaboration</span> — Working with colleagues on a paper examining
              the effects of interdisciplinary approaches in higher education
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Learning & Research</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Current areas of study and exploration:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Deep dive into Stoic philosophy and its practical applications in modern life</li>
            <li>Studying the historical development of mathematical notation and its impact on cognitive processing</li>
            <li>
              Researching the intersection of traditional Eastern educational philosophies and Western pedagogical
              approaches
            </li>
            <li>Learning Classical Greek to better understand original philosophical texts</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Creative & Personal Growth</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Nurturing my creative pursuits and personal development:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Daily writing practice — 750 words each morning as a form of meditation</li>
            <li>Poetry composition — Exploring structured forms like sonnets and villanelles</li>
            <li>Piano practice — Working through Bach's Well-Tempered Clavier</li>
            <li>Mindfulness meditation — Maintaining a consistent 20-minute daily practice</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Fitness & Well-being</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">How I'm maintaining physical and mental health:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Following a 5-day strength training program with emphasis on functional movement</li>
            <li>Daily walks in nature — aiming for 10,000 steps</li>
            <li>Experimenting with intermittent fasting (16:8 protocol)</li>
            <li>Prioritizing sleep hygiene with a consistent 10pm-6am schedule</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Travel & Exploration</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Places I'm visiting or planning to explore:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Recently returned from a two-week stay in Athens studying ancient Greek educational institutions</li>
            <li>Planning a summer retreat to Kyoto to study traditional Japanese educational philosophies</li>
            <li>Weekend explorations of local historical libraries and archives</li>
            <li>Upcoming speaking engagement in Edinburgh in September</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Experiments & Challenges</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Current experiments and personal challenges:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Digital minimalism — Limiting social media to 30 minutes per day</li>
            <li>Cold exposure therapy — Daily cold showers and weekly ice baths</li>
            <li>Handwritten correspondence — Writing one letter per week to maintain meaningful connections</li>
            <li>100-day challenge of learning one new concept from a different discipline each day</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">What I'm Avoiding</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Deliberately stepping back from:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Excessive news consumption and information overload</li>
            <li>Commitments that don't align with my core values and current focus areas</li>
            <li>Reactive work that doesn't contribute to long-term goals</li>
            <li>Environments and relationships that drain rather than energize</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Teaching & Sharing</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">How I'm sharing knowledge and contributing:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Mentoring three graduate students in interdisciplinary research methods</li>
            <li>Monthly seminar series on classical education in the digital age</li>
            <li>Contributing to open-source educational resources</li>
            <li>Writing a bi-weekly newsletter exploring the intersection of philosophy, education, and technology</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Reading</h2>
        <div className="pl-4 border-l-2 border-muted space-y-2">
          <p className="text-muted-foreground">Books currently on my nightstand:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>"Metaphors We Live By" by George Lakoff and Mark Johnson</li>
            <li>"The Master and His Emissary" by Iain McGilchrist</li>
            <li>"Gödel, Escher, Bach" by Douglas Hofstadter (re-reading)</li>
            <li>"The Well-Educated Mind" by Susan Wise Bauer</li>
            <li>"Meditations" by Marcus Aurelius (Gregory Hays translation)</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

