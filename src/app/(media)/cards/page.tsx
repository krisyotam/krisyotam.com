/* ============================================================================
 * page.tsx — 404 Cards Index
 * Kris Yotam | Created: 2026-02-13 | Updated: 2026-02-13
 * @type layout
 * @path src/app/(media)/cards/page.tsx
 * ========================================================================== */

import { PageHeader, PageDescription } from "@/components/core";
import { getAll404Blocks, get404BlockCount } from "@/lib/media-db";
import CardsClientPage from "./CardsClientPage";

export const metadata = {
  title: "Cards",
  description: "404 gacha card collection — every wrong turn is a pull.",
};

const IMG_BASE = "https://krisyotam.com/doc/assets/404/img/";
const AUDIO_BASE = "https://krisyotam.com/doc/assets/404/audio/";
const VIDEO_BASE = "https://krisyotam.com/doc/assets/404/videos/";

const TIER_RATES: Record<string, number> = {
  common: 0.50,
  uncommon: 0.25,
  rare: 0.15,
  legendary: 0.08,
  mythic: 0.02,
};

export default function CardsPage() {
  const blocks = getAll404Blocks();
  const counts = get404BlockCount();

  const cards = blocks.map((b) => ({
    id: b.id,
    img: b.img.startsWith("http") ? b.img : IMG_BASE + b.img,
    msg: b.msg,
    status: b.status,
    invert: b.invert,
    audio: b.audio
      ? b.audio.startsWith("http") ? b.audio : AUDIO_BASE + b.audio
      : null,
    video: b.video
      ? b.video.startsWith("http") ? b.video : VIDEO_BASE + b.video
      : null,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-[1200px] mx-auto px-4 py-8">
        <PageHeader
          title="Cards"
          start_date="2026-02-13"
          end_date={new Date().toISOString().split("T")[0]}
          preview="404 gacha card collection"
        />
        <div className="mt-8">
          <CardsClientPage
            cards={cards}
            counts={counts}
            tierRates={TIER_RATES}
          />
        </div>
        <PageDescription
          title="About this page"
          description="Every wrong turn on this site is a gacha pull. Cards are randomly drawn from a weighted pool when you hit a 404 page. This index shows the full collection with rarity tiers: common, uncommon, rare, legendary, and mythic."
        />
      </main>
    </div>
  );
}
