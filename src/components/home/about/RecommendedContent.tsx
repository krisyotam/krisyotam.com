"use client"

import React from 'react'
import Collapse from "@/components/typography/collapse"
import Link from 'next/link'

export default function RecommendedContent() {
  return (
    <Collapse title="Recommended" className="w-full mb-4">
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <p>
          New to this site? There's a ton here so take your time. Here are some recommendations 
          for thing's you should check out as a new reader.
        </p>
        
        <p>
          Some of these are fairly interesting but straightforward enough to dive into, others may be 
          more interesting for someone who knows a bit more about the specific topic.
        </p>
        
        <h5 className="text-sm font-medium mt-4">Papers</h5>
        <ul>
          <li><Link href="/papers/ai/simulating-moral-judgment-llms" className="text-foreground hover:text-primary">Simulating Human Moral Judgement in LLMs</Link></li>
          <li><Link href="/papers/self-experiments/nootropics-performance-study" className="text-foreground hover:text-primary">Quantifying the Perceived and Measured Effects of Nootropics on Cognitive Performance</Link></li>
          <li><Link href="/papers/psychology/achievement-open-source-iq" className="text-foreground hover:text-primary">Predicting Real-World Achievement from Open-Source Intelligence</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Essays</h5>
        <ul>
          <li><Link href="/essays/pedagogy/reflections-on-lifelong-study" className="text-foreground hover:text-primary">Reflections On Lifelong Study</Link></li>
          <li><Link href="/essays/pedagogy/on-the-learning-of-difficult-things" className="text-foreground hover:text-primary">On the Learning Of Difficult Things</Link></li>
          <li><Link href="/essays/philosophy/on-being-wounded" className="text-foreground hover:text-primary">On Being Wounded</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Blog Posts</h5>
        <ul>
          <li><Link href="/blog/close-reading-verse/the-waste-land-close-reading" className="text-foreground hover:text-primary">The Waste Land, Close Reading</Link></li>
          <li><Link href="/blog/close-reading-verse/ulalume-close-reading" className="text-foreground hover:text-primary">Ulalume, Close Reading</Link></li>
          <li><Link href="/blog/thought-experiments/reply-to-mephisto" className="text-foreground hover:text-primary">Reply To Mephisto</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Lectures</h5>
        <ul>
          <li><Link href="/lectures/theology/the-five-ways-breakdown" className="text-foreground hover:text-primary">The Five Ways, Breakdown</Link></li>
          <li><Link href="/lectures/literature/toward-a-theory-of-film-critique" className="text-foreground hover:text-primary">Toward a Theory of Film Critique</Link></li>
          <li><Link href="/lectures/literature/toward-a-theory-of-literature-critique" className="text-foreground hover:text-primary">Toward a Theory of Literature Critique</Link></li>
          <li><Link href="/lectures/prose/on-prose" className="text-foreground hover:text-primary">On Prose</Link></li>
          <li><Link href="/lectures/progymnasmata/fable" className="text-foreground hover:text-primary">On Fable</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Reviews</h5>
        <ul>
          <li><Link href="/reviews/film/jeanne-dielman" className="text-foreground hover:text-primary">Jeanne Dielman, 23, quai du Commerce, 1080 Bruxelles (1975)</Link></li>
          <li><Link href="/reviews/film/logh" className="text-foreground hover:text-primary">Legend Of The Galactic Heroes</Link></li>
          <li><Link href="/reviews/manga/aku-no-hana" className="text-foreground hover:text-primary">Aku no Hana</Link></li>
          <li><Link href="/reviews/film/girl-interrupted" className="text-foreground hover:text-primary">Girl, Interrupted</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Cases</h5>
        <ul>
          <li><Link href="/cases/internet-mysteries/cicada-3301" className="text-foreground hover:text-primary">Cicada 3301</Link></li>
          <li><Link href="/cases/internet-mysteries/a858-stonehenge-redux" className="text-foreground hover:text-primary">A858 Stonehenge Redux</Link></li>
          <li><Link href="/cases/internet-mysteries/markovian-parallax-denigrate" className="text-foreground hover:text-primary">Markovian Parallax Denigrate</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Dossiers</h5>
        <ul>
          <li><Link href="/dossiers/darknet/silkroad" className="text-foreground hover:text-primary">Silk Road</Link></li>
          <li><Link href="/dossiers/darknet/raidforums" className="text-foreground hover:text-primary">Raid Forums</Link></li>
          <li><Link href="/dossiers/unidentified-persons/boy-in-the-box-1957" className="text-foreground hover:text-primary">The Boy in The Box (1957)</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Conspiracies</h5>
        <ul>
          <li><Link href="/flat-earth/flat-earth-resurgence" className="text-foreground hover:text-primary">The Flat Earth</Link></li>
          <li><Link href="/conspiracies/illuminati/13-bloodlines" className="text-foreground hover:text-primary">The Illuminati or New World Order</Link></li>
          <li><Link href="/conspiracies/cia-projects/9-11" className="text-foreground hover:text-primary">9/11 was a Inside Job</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Notes</h5>
        <ul>
          <li><Link href="/notes/on-myself/about-kris" className="text-foreground hover:text-primary">About Me</Link>: who am i? What do i do?, and why?</li>
          <li><Link href="/notes/website/about-this-website" className="text-foreground hover:text-primary">About This Website</Link>: a in-depth explanation of the theory behind this website</li>
          <li><Link href="/notes/website/design-of-this-website" className="text-foreground hover:text-primary">Design of This Website</Link>: a in-depth explanation of the theory behind this site's design</li>
          <li><Link href="/notes/manuals-of-style/takes-on-prose" className="text-foreground hover:text-primary">Takes on Prose</Link>: a style guide for prose types used on this site</li>
          <li><Link href="/notes/manuals-of-style/takes-on-llms" className="text-foreground hover:text-primary">Takes on LLMs</Link>: a style guide for llm use on this site</li>
          <li><Link href="/notes/on-myself/favs" className="text-foreground hover:text-primary">My Favorite Things</Link>: people ask what my fav [thing] is. This is my attempt to answer that</li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Verse</h5>
        <ul>
          <li><Link href="/verse/lyric/2025/exaltatio-mortis" className="text-foreground hover:text-primary">Exaltatio Mortis or "The Banquet of the Dead"</Link></li>
          <li><Link href="/verse/sonnet/2025/shall-i-compare-thee-to-a-winters-night" className="text-foreground hover:text-primary">Shall I Compare thee to a Winter's Night?</Link></li>
          <li><Link href="/verse/elegy/2025/elegy-of-the-saints" className="text-foreground hover:text-primary">Elegy of the Saints</Link></li>
        </ul>
        
        <h5 className="text-sm font-medium mt-4">Pages</h5>
        <ul>
          <li><Link href="/contact" className="text-foreground hover:text-primary">Contact</Link>: get in contact with me</li>
          <li><Link href="/supporters" className="text-foreground hover:text-primary">Supporters</Link>: view contributers to the site</li>
          <li><Link href="/globe" className="text-foreground hover:text-primary">Globe</Link>: view places i've been</li>
        </ul>
      </div>
    </Collapse>
  )
}
