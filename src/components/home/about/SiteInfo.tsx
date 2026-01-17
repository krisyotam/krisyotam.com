"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const THEME_SONG_DATA = {
  caption: "\"La Campanella\" is my theme song, hopefully I'll play it some day... Enjoy this radiant rendition by @kassiapiano on youtube.",
  stickerUrl: "https://i.postimg.cc/tT8GV4gS/cping.webp",
  themeSongUrl: "https://gateway.pinata.cloud/ipfs/bafybeiczt2j4vlu2adk4l7rcbzaxl62zm3orm44rabavzqkjtwgjijmuzm"
}

export default function SiteInfo() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-center">
              <div className="relative w-full h-[200px]">
                <div className="dark:block hidden w-full h-full relative">
                  <Image
                    src="https://krisyotam.com/doc/site/krisyotam-site-sticker-darkmode.gif"
                    alt="Site Sticker Dark Mode"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                    unoptimized
                  />
                </div>
                <div className="dark:hidden block w-full h-full relative">
                  <Image
                    src="https://krisyotam.com/doc/site/krisyotam-site-sticker-lightmode.gif"
                    alt="Site Sticker Light Mode"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <p className="text-muted-foreground mb-3">{THEME_SONG_DATA.caption}</p>
            <audio controls className="w-full mt-2">
              <source src={THEME_SONG_DATA.themeSongUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
