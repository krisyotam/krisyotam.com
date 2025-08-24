"use client"

import type { ReactNode } from "react"

interface SimpleTweetEmbedProps {
  id: string
  caption?: ReactNode
  theme?: "light" | "dark"
}

function Caption({ children }: { children: ReactNode }) {
  return <div className="text-sm text-gray-500 mt-2 text-center">{children}</div>
}

export function SimpleTweetEmbed({ id, caption, theme = "light" }: SimpleTweetEmbedProps) {
  // Use Twitter's oEmbed approach which is much simpler and doesn't require script loading
  const tweetUrl = `https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-${id}&frame=false&hideCard=false&hideThread=false&id=${id}&theme=${theme}`

  return (
    <div className="flex flex-col items-center my-6">
      <div className="w-full max-w-[550px] overflow-hidden rounded-lg border border-gray-200">
        <iframe
          title={`Twitter Tweet ${id}`}
          src={tweetUrl}
          width="100%"
          height="320"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allowTransparency={true}
          allow="encrypted-media"
        ></iframe>
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  )
}

