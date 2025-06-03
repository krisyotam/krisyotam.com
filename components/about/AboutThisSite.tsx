"use client"

import React from "react"
import Collapse from "@/components/posts/typography/collapse"
import Dropcap from "@/components/dropcap"

export default function AboutThisSite() {
  return (
    <Collapse title="About This Site" className="w-full mt-6 mb-4">
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <p>
          <Dropcap type="william-morris-gothic">T</Dropcap>his site belongs to <strong>Kris Yotam</strong>. I write about AI, mathematics, art, philosophy, psychology, literature, history, and much more. I am an undergraduate student in Mathematics with a specialization in Pure Mathematics. The main content on this site is arranged in a tiered hierarchy. The highest tier is <a href="/essays">Essays</a>—long-form, stable posts that are continually revised as long as their topics remain relevant. These can be accessed through the <a href="/">main feed</a>, the <a href="/essays">essays page</a>, or browsed by <a href="/tags">tags</a>, <a href="/categories">categories</a>, and <a href="/series">series</a>. Some essays may eventually be deprecated if a subject becomes obsolete—such as when a tool is no longer supported.
        </p>
        <p>
          <a href="/blog">Blog Posts</a> are reserved for short-form thoughts, quick essays, and reflections. <a href="/notes">Notes</a> may be the most expansive section of the site, featuring reviews of books, anime, manga, literature, cuisine, as well as CTF writeups, algorithmic coding challenge solutions, and curated library catalogues from academics and notable internet figures.
        </p>
        <p>
          There is also other content such as my original <a href="/verse">Poetry</a>, formal <a href="/reports">Academic Essays</a>, and my <a href="/lecture-notes">Lecture Notes</a> for classes, courses, and guest lectures. Pages like <a href="/library">Library</a> archive my personal physical book collection, while <a href="/reading">Reading</a> tracks my current reading sessions. You'll also find <a href="/anime">Anime</a>, <a href="/manga">Manga</a>, <a href="/film">Film</a>, and <a href="/music">Music</a>, which document my media consumption across each of those domains.
        </p>
      </div>
    </Collapse>
  )
}
