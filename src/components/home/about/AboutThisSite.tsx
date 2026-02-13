"use client"

import React from "react"
import Collapse from "@/components/typography/collapse"
import Dropcap from "@/components/core/dropcap"

export default function AboutThisSite() {
  return (
    <Collapse title="About This Site" className="w-full mt-6 mb-4">
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <p>
          <Dropcap type="william-morris-gothic">T</Dropcap>his site belongs to <strong>Kris Yotam</strong>. I write about AI, mathematics, art, philosophy, psychology, literature, history, and much more. I am an undergraduate student in Mathematics with a specialization in Pure Mathematics.
        </p>
        <p>
          The main content on this site is arranged in a tiered hierarchy. The highest tier is <a href="/essays">Essays</a>—long-form, stable posts that are continually revised as long as their topics remain relevant. These can be accessed through the <a href="/">main feed</a>, the <a href="/essays">essays page</a>, or browsed by <a href="/tags">tags</a>, <a href="/categories">categories</a>, and <a href="/series">series</a>. Some essays may eventually be deprecated if a subject becomes obsolete—such as when a tool is no longer supported.
        </p>
        <p>
          <a href="/blog">Blog Posts</a> are reserved for short-form thoughts, quick essays, and reflections. <a href="/notes">Notes</a> may be the most expansive section of the site, featuring reviews of books, anime, manga, literature, cuisine, as well as CTF writeups, algorithmic coding challenge solutions, and curated library catalogues from academics and notable internet figures.
        </p>
        <p>
          There is also other content such as my original <a href="/verse">Poetry</a>, formal <a href="/reports">Academic Essays</a>, and my <a href="/lecture-notes">Lecture Notes</a> for classes, courses, and guest lectures. Pages like <a href="/library">Library</a> archive my personal physical book collection, while <a href="/reading">Reading</a> tracks my current reading sessions. You’ll also find <a href="/anime">Anime</a>, <a href="/manga">Manga</a>, <a href="/film">Film</a>, and <a href="/music">Music</a>, which document my media consumption across each of those domains.
        </p>
        <p>
          I write a dedicated series of classical rhetorical exercises known as <a href="/progymnasmata">Progymnasmata</a>, inspired by Aelius Theon and the ancient Greek tradition. These exercises help refine argumentation, stylistic clarity, and narrative construction.
        </p>
        <p>
          I am also a Bible-believer, and have created a clean, scripturally referenced version of the 613 commandments—known as the mitzvot—presented clearly and readably at <a href="/mitzvah">/mitzvah</a>.
        </p>
        <p>
          Among the lighter offerings is a cultural preservation of one of the internet’s most storied traditions: the <a href="/rules-of-the-internet">Rules of the Internet</a>, reformatted and archived here for historical and ironic appreciation.
        </p>
        <p>
          For navigation, the site includes several unique features: on the <a href="/">homepage</a>, a button in the bottom-left corner toggles between grid and list views for browsing posts. Most top-level pages also include a discreet question mark icon in the lower left—clicking it reveals a helpful page explanation.
        </p>
        <p>
          The floating button in the bottom-right corner labeled <code>⌘K</code> opens the global <strong>Command Menu</strong>. From here, you can instantly jump to any page, toggle between light and dark themes, and explore the full index of site sections ranging from essays and blog posts to playlists and academic resources.
        </p>
        <p>
          The gear icon in the top-right corner opens the <strong>Settings Menu</strong>, which includes:
        </p>
        <ul>
          <li><strong>Search</strong> — a floating window with support for posts, pages, and even Bible search across various versions.</li>
          <li><strong>Link Preview Mode</strong> — configure how external links are opened (e.g., modal vs. direct).</li>
          <li><strong>Quick Links</strong> — jump to RSS, FAQ, changelog, GitHub, or user settings instantly.</li>
        </ul>
        <p>
          Together, these tools aim to keep the interface minimal yet powerful, ensuring that both new readers and returning visitors can explore with ease and precision.
        </p>
      </div>
    </Collapse>
  )
}
