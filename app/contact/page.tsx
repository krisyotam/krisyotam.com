"use client"

import ContactForm from "@/components/ContactForm"
import ContactInfo from "@/components/contact-info"
import PGP from "@/components/pgp"
import contactData from "@/data/contact.json"
import pgpData from "@/data/pgp.json"
import contactFormInfo from "@/data/contact-form-info.json"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
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
        <Card className="!p-4 !bg-card dark:!bg-zinc-900 !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-6">
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

        <ContactForm />
      </div>
    </div>
  )
}

