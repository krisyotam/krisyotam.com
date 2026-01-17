/**
 * Home Header Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Logo and QR code bento grid for home page
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartButton } from "@/components/heart-button"
import Image from "next/image"

export function HomeHeader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-0">
        <CardContent className="p-0 flex flex-col items-center justify-between h-full">
          <div className="relative w-[360px] h-[360px] mt-8 -mb-8">
            <Image
              src="https://krisyotam.com/doc/assets/logos/krisyotam-personal-crest.png"
              alt="Kris Yotam Logo"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md logo-light select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              priority
              unoptimized
            />
            <Image
              src="https://krisyotam.com/doc/assets/logos/krisyotam-personal-crest-darkmode.png"
              alt="Kris Yotam Logo (Dark Mode)"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md logo-dark select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col items-center gap-1 mt-0">
            <p className="text-center text-sm text-muted-foreground">
              toward a examined life
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <a href="/me" target="_blank" rel="noopener noreferrer">
                  About Me
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <a href="/about" target="_blank" rel="noopener noreferrer">
                  About Website
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <a href="/logo" target="_blank" rel="noopener noreferrer">
                  About Logo
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-0">
        <CardContent className="p-0 flex flex-col items-center justify-between h-full">
          <div className="relative w-[340px] h-[340px] mt-8">
            <Image
              src="https://krisyotam.com/doc/assets/logos/krisyotam-light.png"
              alt="Kris Yotam QR Code"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md logo-light select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              priority
              unoptimized
            />
            <Image
              src="https://krisyotam.com/doc/assets/logos/krisyotam-dark.png"
              alt="Kris Yotam QR Code (Dark Mode)"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md logo-dark select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col items-center gap-2 mt-6">
            <p className="text-center text-sm text-muted-foreground">
              💡 If you find something here worth preserving...
            </p>
            <div className="flex items-center gap-2">
              <HeartButton />
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <a href="https://buy.stripe.com/bJe00ibt4eVe1gA90q4Ni00" target="_blank" rel="noopener noreferrer">
                  ☕ Buy Me Tea
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <a href="https://krisyotam.substack.com/" target="_blank" rel="noopener noreferrer">
                  📩 Join the List
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
