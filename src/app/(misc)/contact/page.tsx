/**
 * ============================================================================
 * Contact Page
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: page.tsx
 * Description: Contact page with email rules, alternative contact methods,
 *              PGP encryption details, and a contact form.
 * ============================================================================
 */

"use client";

import dynamic from "next/dynamic";
import ContactInfo from "@/components/contact-info";
import PGP from "@/components/pgp";
import { Card } from "@/components/ui/card";
import { Users, Hash } from "lucide-react";
import { PageHeader } from "@/components/core";

// ============================================================================
// DYNAMIC IMPORTS
// ============================================================================

const ContactFormWithNoSSR = dynamic(
  () => import("@/components/ContactForm"),
  {
    ssr: false,
    loading: () => <p>Loading form...</p>,
  }
);

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

const PGP_DATA = {
  email: "krisyotam@protonmail.com",
  fingerprint: "48219a263bdc66cb2af42c9894b8d8898d145952",
  mirror: "pgp.krisyotam.com",
  publicKey: "xjMEZhEGohYJKwYBBAHaRw8BAQdABZtJxhY8Ny8LxTqy7X7k+e5Q0aX+EBcrbPGXqmTvQHbNM2tyaXN5b3RhbUBwcm90b25tYWlsLmNvbSA8a3Jpc3lvdGFtQHByb3Rvbm1haWwuY29tPsKMBBAWCgA+BYJmEQaiBAsJBwgJkJS42ImNFFlSAxUICgQWAAIBAhkBApsDAh4BFiEESCGaJjvcZssq9CyYlLjYiY0UWVIAAPj7AP9CtvHMQMch3KDASBfnujRrFBUlRA6/6k0y0mNNF5CHAAEA+2SjjGheM8FBHLUR5mAoWJ5eNdWCElXRJgH6H9Ikaws=",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactPage() {
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

        {/* Alternative Contact Methods */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-6">
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
                  <span className="!font-medium">Discord:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">
                    krisyotam
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* PGP Component */}
        <div className="mb-6">
          <PGP
            email={PGP_DATA.email}
            fingerprint={PGP_DATA.fingerprint}
            publicKey={PGP_DATA.publicKey}
            mirror={PGP_DATA.mirror}
          />
        </div>

        {/* Contact Form */}
        <ContactFormWithNoSSR />
      </div>
    </div>
  );
}
