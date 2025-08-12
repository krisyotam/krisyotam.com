"use client"

import siteInfoData from "@/data/site-info.json"
import themeSongData from "@/data/theme-song-caption.json"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function SiteInfo() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-center">
              <div className="relative w-full h-[200px]">                <div className="dark:block hidden w-full h-full relative">
                  <Image
                    src="https://doc.krisyotam.com/site/krisyotam-site-sticker-darkmode.gif"
                    alt="Site Sticker Dark Mode"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                  />
                </div>
                <div className="dark:hidden block w-full h-full relative">
                  <Image
                    src="https://doc.krisyotam.com/site/krisyotam-site-sticker-lightmode.gif"
                    alt="Site Sticker Light Mode"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <p className="text-muted-foreground mb-3">{themeSongData.caption}</p>
            <audio controls className="w-full mt-2">
              <source src={themeSongData.themeSongUrl} type="audio/mpeg" />
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
            {siteInfoData.map((site, index) => (
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