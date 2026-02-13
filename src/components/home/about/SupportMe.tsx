"use client"

import React from "react"
import Collapse from "@/components/typography/collapse"
import { Notice } from "@/components/typography/notice"

export default function SupportMe() {
  return (
    <Collapse title="Support Me" className="w-full mb-4">
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <Notice type="info">
          These methods have not yet been fully set up yet. You will know they have been set up when this notice is removed. Until then, if you'd like to support me, please see the "Buy Me a Tea" option above!
        </Notice>
        
        <p>
          I spend a lot of time learning. I also spend a lot of time writing about it. Through this process, I have found thousands of unique ideas, underseen content, and have created some gems myself. If you value any of this and would like to support this site, I have tried to make it as easy and profitable for you to do so.
        </p>
        
        <h5 className="text-sm font-medium mt-4">Patreon Tiers</h5>
        
        <ul className="space-y-4">
          <li>
            <strong>Supporter ($5)</strong>: Access to downloadable Obsidian notes
          </li>
          
          <li>
            <strong>Muse ($10)</strong>: Choose 2 characters and fitting theme for me to write a blog post about
          </li>
          
          <li>
            <strong>Patron ($20)</strong>: Web Clippings, Private Downloadable Archive, Obsidian Repo (Access to make contributions on GitHub), Anki Flash Cards, Vote on Essay Topics
          </li>
        </ul>
      </div>
    </Collapse>
  )
}
