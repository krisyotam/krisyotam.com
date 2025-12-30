"use client"

import dynamic from 'next/dynamic'
import ContactInfo from "@/components/contact-info"
import PGP from "@/components/pgp"
import contactData from "@/data/contact.json"
import pgpData from "@/data/pgp.json"
import contactFormInfo from "@/data/contact-form-info.json"
import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Hash } from 'lucide-react'
import { PageHeader } from "@/components/core"

// Dynamically import ContactForm with no SSR
const ContactFormWithNoSSR = dynamic(() => import('@/components/ContactForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>, 
})

// Contact page metadata
const contactPageData = {
  title: "Contact",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Various ways to contact me, including email, PGP encryption, and a contact form.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 7,
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-[850px] mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={contactPageData.title}
          start_date={contactPageData.start_date}
          end_date={contactPageData.end_date}
          preview={contactPageData.preview}
          status={contactPageData.status}
          confidence={contactPageData.confidence}
          importance={contactPageData.importance}
        />
          {/* Contact Info Component */}
        <ContactInfo
          notice={contactData.Notice}
          rules={contactData.Rules}
          blacklistNotes={contactData["Blacklist"]}
        />

        {/* Alternative Contact Methods Bento */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-6">
          <div className="!flex !items-start !gap-3">
            <Users className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-2">Alternative Contact Methods</h3>
              <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-2">
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Matrix:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">@krisyotam:matrix.org</code>
                </div>
                <div className="!flex !items-center !gap-2">
                  <Hash className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
                  <span className="!font-medium">Discord:</span>
                  <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-1 !rounded !text-xs">krisyotam</code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* PGP Component */}
        <div className="mb-6">
          <PGP
            email={pgpData.email}
            fingerprint={pgpData.fingerprint}
            publicKey={pgpData.publicKey}
            mirror={pgpData.mirror}
          />
        </div>        {/* Contact Form Info Bento */}
        <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-6">
          <div className="!flex !items-start !gap-3">
            <MessageSquare className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-2">Get in Touch</h3>
              <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-2">
                {contactFormInfo.text.split(". ").map((sentence, index) => (
                  <p key={index} className={index !== 0 ? "!mt-2" : ""}>
                    {sentence}
                    {index < contactFormInfo.text.split(". ").length - 1 ? "." : ""}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <ContactFormWithNoSSR />
      </div>
    </div>
  )
}
