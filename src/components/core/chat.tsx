"use client"

import Script from "next/script"

interface ChatProps {
  chatId?: string
  className?: string
}

export function Chat({ chatId = "41073924", className }: ChatProps) {
  return (
    <>
      <Script
        src="https://beta.iframe.chat/scripts/main.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).chattable) {
            (window as any).chattable.initialize({
              stylesheet: "/chattable.css"
            })
          }
        }}
      />
      <iframe
        src={`https://beta.iframe.chat/embed?chat=${chatId}`}
        id="chattable"
        frameBorder="0"
        className={className}
        title="Live Chat"
      />
    </>
  )
}
