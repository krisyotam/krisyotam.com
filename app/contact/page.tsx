"use client"

import dynamic from 'next/dynamic'
import ContactInfo from "@/components/contact-info"
import PGP from "@/components/pgp"
import contactData from "@/data/contact.json"
import pgpData from "@/data/pgp.json"
import contactFormInfo from "@/data/contact-form-info.json"
import { Card } from "@/components/ui/card"
import { MessageSquare } from 'lucide-react'
import { PageHeader } from "@/components/page-header"

// Dynamically import ContactForm with no SSR
const ContactFormWithNoSSR = dynamic(() => import('@/components/ContactForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>, 
})

// Contact page metadata
const contactPageData = {
  title: "Contact",
  date: new Date().toISOString(),
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
          date={contactPageData.date}
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

        {/* PGP Component */}
        <div className="mb-6">
          <PGP
            email={pgpData.email}
            fingerprint={pgpData.fingerprint}
            publicKey={pgpData.publicKey}
            mirror={pgpData.mirror}
          />
        </div>

        {/* Contact Form Info Bento */}
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
