"use client"

import { ResumeHeader } from "@/components/resume-header"
import { ResumeSection } from "@/components/resume-section"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import cv from "@/data/cv" // Ensure this is the correct import path
import { useRef } from "react"

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10 print:bg-white print:py-0 dark:bg-muted/20 dark:text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex justify-end print:hidden">
          <Button onClick={handlePrint} variant="secondary" className="gap-2 bg-black text-white hover:bg-black/90 dark:bg-gray-800 dark:text-white">
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>

        <div ref={resumeRef} className="space-y-8 bg-white p-10 shadow-sm print:shadow-none dark:bg-gray-800 dark:text-gray-200">
          <ResumeHeader name={cv.name} title={cv.title} contact={cv.contact} summary={cv.summary} />

          <Separator className="my-6" />

          <div className="space-y-6">
            <ResumeSection title="Experience" items={cv.experience} />
            <ResumeSection title="Education" items={cv.education} />
            <ResumeSection title="Skills" items={cv.skills} />
            <ResumeSection title="Projects" items={cv.projects} />
            <ResumeSection title="Certifications" items={cv.certifications} />
          </div>
        </div>
      </div>
    </main>
  )
}
