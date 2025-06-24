import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import faqData from "@/data/faq.json"

export const metadata: Metadata = {
  title: "FAQ - KrisYotam",
  description: "Frequently asked questions about KrisYotam.com and its content.",
}

export default function FAQPage() {
  const { metadata, faqs } = faqData

  return (
    <div className="container max-w-[650px] mx-auto px-4 py-12">
      <PageHeader title="FAQ" description={metadata.description} date={metadata.lastUpdated} />

      <div className="mt-8 space-y-4">
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors text-left justify-start">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground py-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{faq.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date(metadata.lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}
