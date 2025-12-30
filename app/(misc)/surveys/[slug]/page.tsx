"use client"

import { notFound } from "next/navigation"
import surveysDataRaw from "@/data/surveys/surveys.json"
import ContactForm from "@/components/ContactForm"
import AnonymousFeedbackForm from "@/components/surveys/anonymous-feedback"
import { PostHeader } from "@/components/post-header"
import { Footer } from "@/components/footer"
import SiteFooter from "@/components/typography/expanded-footer-block"
import SurveyPageClient from "./SurveyPageClient"

// Types
export type Survey = {
  title: string
  preview: string
  start_date: string
  end_date: string
  slug: string
  status: string
  confidence: string
  importance: number
  state: string
}

type SurveysJson = {
  shortform: Survey[]
}

const surveysData: SurveysJson = surveysDataRaw as SurveysJson

export default function SurveySlugPage({ params }: { params: { slug: string } }) {
  const survey = surveysData.shortform.find(s => s.slug === params.slug && s.state === "active")
  if (!survey) return notFound()

  return <SurveyPageClient survey={survey} />;
}
