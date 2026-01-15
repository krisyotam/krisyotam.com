"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const SITE_INFO_DATA = [
  {
    Name: "Open-Source Version",
    Purpose: "A minimalist version of this site for those interested",
    Link: "https://example.com/open-source"
  },
  {
    Name: "Paid-Version",
    Purpose: "More complex than the open-source version with all current page components *does not include post components",
    Link: "https://example.com/paid-version"
  },
  {
    Name: "Mystery Box",
    Purpose: "Contains unknown items for those seeking surprise and curiosity",
    Link: "https://example.com/mystery-box"
  }
]

const THEME_SONG_DATA = {
  caption: "\"La Campanella\" is my theme song, hopefully I'll play it some day... Enjoy this radiant rendition by @kassiapiano on youtube.",
  stickerUrl: "https://i.postimg.cc/tT8GV4gS/cping.webp",
  themeSongUrl: "https://gateway.pinata.cloud/ipfs/bafybeiczt2j4vlu2adk4l7rcbzaxl62zm3orm44rabavzqkjtwgjijmuzm"
}

export default function SiteInfo() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-center">
              <div className="relative w-full h-[200px]">                <div className="dark:block hidden w-full h-full relative">
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {SITE_INFO_DATA.map((site, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">
                  <a
                    href={site.Link}
                    target="_blank"
                    data-no-preview="true"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    {site.Name}
                  </a>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{site.Purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 