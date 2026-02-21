"use client";

import ContactInfo from "@/components/contact/contact-info";
import PGP from "@/components/contact/pgp";
import IRC from "@/components/contact/irc";
import type { IRCNetwork } from "@/components/contact/irc";
import { Card } from "@/components/ui/card";
import { Users, Hash, Globe, Share2 } from "lucide-react";
import { PageHeader, Survey } from "@/components/core";
import type { SurveySchema } from "@/lib/survey-parser";

// ============================================================================
// PAGE METADATA
// ============================================================================

const PAGE_METADATA = {
  title: "Contact",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split("T")[0],
  preview:
    "Various ways to contact me, including email, PGP encryption, and a contact form.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 7,
};

// ============================================================================
// CONTACT DATA
// ============================================================================

const CONTACT_NOTICE = {
  message:
    "I'm not on Telegram, I'm not on Twitter, I'm not on Facebook, I am on Reddit occasionally Quora, and no account anywhere imitating me or any of my 'brands' has any association with me other than fraudulent. Any profile not linked from this site is simply not mine.",
};

const CONTACT_RULES = [
  {
    rule: "Don't get offended if you don't get a response. I get a lot of email. I can't do pen pals.",
  },
  {
    rule: "Don't contact me about gossip (especially if it's about me), or conspiracies (use the form).",
  },
  {
    rule: "Don't contact me asking me to shill your product unless it is all free software and you have some comprehension of the themes of my blog. It should go without saying that we're not consumers here.",
  },
];

const CONTACT_BLACKLIST = {
  message:
    "My email server cannot communicate with iCloud or Zoho addresses, so if you have one of these accounts, do not email me there.",
};

const IRC_NETWORKS: IRCNetwork[] = [
  {
    name: "Libera.Chat",
    hostname: "irc.libera.chat",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#krisyotam",
    description: "Primary form of communication",
  },
  {
    name: "Redacted (RED)",
    hostname: "irc.interviewfor.red",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#recruitment",
    description: "Music",
  },
  {
    name: "Orpheus (OPS)",
    hostname: "irc.orpheus.network",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#interview",
    description: "Music",
  },
  {
    name: "BrokenSphere (KG / SC)",
    hostname: "irc.brokensphere.net",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#karagarga",
    description: "Art house film, world cinema",
  },
  {
    name: "PassThePopcorn (PTP)",
    hostname: "irc.passthepopcorn.me",
    port: 7000,
    ssl: true,
    nick: "khr1st",
    description: "Film",
  },
  {
    name: "hackint",
    hostname: "irc.hackint.org",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    description: "Hacker community, CCC-affiliated",
  },
  {
    name: "OFTC",
    hostname: "irc.oftc.net",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    description: "Infrastructure, Debian, Tor",
  },
  {
    name: "tilde.chat",
    hostname: "irc.tilde.chat",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    description: "Tildeverse — academia, digital humanities",
  },
  {
    name: "AnimeBytes (AB)",
    hostname: "irc.animebytes.tv",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#support",
    description: "Anime, manga, Japanese music",
  },
  {
    name: "Rizon (BakaBT)",
    hostname: "irc.rizon.net",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#bakabt",
    description: "Anime, fansubs",
  },
  {
    name: "IRCHighway",
    hostname: "irc.irchighway.net",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#ebooks",
    description: "Books, ebooks",
  },
  {
    name: "Undernet",
    hostname: "irc.undernet.org",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#Bookz",
    description: "Books",
  },
  {
    name: "Canternet (DimeADozen)",
    hostname: "irc.canternet.org",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    channel: "#dimeadozen",
    description: "Music — live recordings, bootlegs",
  },
  {
    name: "MyAnonamouse (MAM)",
    hostname: "irc.myanonamouse.net",
    port: 6697,
    ssl: true,
    nick: "khr1st",
    description: "Books, audiobooks, academic texts",
  },
];

const PGP_DATA = {
  email: "kris@krisyotam.com",
  fingerprint: "48219a263bdc66cb2af42c9894b8d8898d145952",
  mirror: "https://krisyotam.com/pgp",
  publicKey: "xjMEZhEGohYJKwYBBAHaRw8BAQdABZtJxhY8Ny8LxTqy7X7k+e5Q0aX+EBcrbPGXqmTvQHbNM2tyaXN5b3RhbUBwcm90b25tYWlsLmNvbSA8a3Jpc3lvdGFtQHByb3Rvbm1haWwuY29tPsKMBBAWCgA+BYJmEQaiBAsJBwgJkJS42ImNFFlSAxUICgQWAAIBAhkBApsDAh4BFiEESCGaJjvcZssq9CyYlLjYiY0UWVIAALPVAP91aquLM/vohDWJ2OkRbuRTxZ2beYBrSUTH9vVyJ++YwgEAr/eyXMuOmesc8Yrh69/Cqrj1etHd8NveDz2gwAOgkwDOOARmEQaiEgorBgEEAZdVAQUBAQdAtGAx6gPp6cE6xSnnW1HtwN4IdoE1afHCV/Eh+XsAxEsDAQgHwngEGBYKACoFgmYRBqIJkJS42ImNFFlSApsMFiEESCGaJjvcZssq9CyYlLjYiY0UWVIAAPj7AP9CtvHMQMch3KDASBfnujRrFBUlRA6/6k0y0mNNF5CHAAEA+2SjjGheM8FBHLUR5mAoWJ5eNdWCElXRJgH6H9Ikaws=",
};

// ============================================================================
// COMPONENT
// ============================================================================

interface ContactPageClientProps {
  schema: SurveySchema;
}

export default function ContactPageClient({ schema }: ContactPageClientProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    const res = await fetch("/api/surveys/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveySlug: "contact",
        responseData: data,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to submit contact form");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-[850px] mx-auto p-8 md:p-16 lg:p-24">
        {/* Page Header */}
        <PageHeader
          title={PAGE_METADATA.title}
          start_date={PAGE_METADATA.start_date}
          end_date={PAGE_METADATA.end_date}
          preview={PAGE_METADATA.preview}
          status={PAGE_METADATA.status}
          confidence={PAGE_METADATA.confidence}
          importance={PAGE_METADATA.importance}
        />

        {/* Contact Info Component */}
        <ContactInfo
          notice={CONTACT_NOTICE}
          rules={CONTACT_RULES}
          blacklistNotes={CONTACT_BLACKLIST}
        />

        {/* Fediverse */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-4">
          <div className="!flex !items-start !gap-3">
            <Share2 className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-2">
                Fediverse
              </h3>
              <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-2">
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Mastodon:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    @placeholder
                  </code>
                </div>
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Bluesky:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    @placeholder
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* IRC — showing only primary network; toggle IRC_VISIBLE_COUNT to reveal more */}
        <IRC networks={IRC_NETWORKS.slice(0, 1)} />

        {/* Indie Web */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-4">
          <div className="!flex !items-start !gap-3">
            <Globe className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-2">
                Indie Web
              </h3>
              <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-2">
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Neocities:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    placeholder
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alternative Contact Methods */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-4">
          <div className="!flex !items-start !gap-3">
            <Users className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-2">
                Alternative Contact Methods
              </h3>
              <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-2">
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Matrix:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    @krisyotam:matrix.org
                  </code>
                </div>
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Signal:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    krisyotam.44
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* PGP Component */}
        <div className="mb-4">
          <PGP
            email={PGP_DATA.email}
            fingerprint={PGP_DATA.fingerprint}
            publicKey={PGP_DATA.publicKey}
            mirror={PGP_DATA.mirror}
          />
        </div>

        {/* Contact Form (Modern Survey) */}
        <div className="mt-0">
          <div className="!border !border-border dark:!border-zinc-800 !bg-card dark:!bg-[#1A1A1A] !px-4 !py-2 !mb-4 !text-center">
            <span className="!text-sm !font-medium !text-muted-foreground dark:!text-zinc-400 !uppercase !tracking-wide">
              Contact Form
            </span>
          </div>
          <Survey schema={schema} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
