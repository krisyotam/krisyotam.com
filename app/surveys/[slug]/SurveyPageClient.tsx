/* app/surveys/[slug]/SurveyPageClient.tsx */
"use client";

import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";
import SiteFooter from "@/components/typography/expanded-footer-block";
import ContactForm from "@/components/ContactForm";
import AnonymousFeedbackForm from "@/components/surveys/anonymous-feedback";
import { LiveClock } from "@/components/live-clock";
import dynamic from "next/dynamic";

export type Survey = {
  title: string;
  preview: string;
  start_date: string;
  end_date: string;
  slug: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
};

interface Props {
  survey: Survey;
}

export default function SurveyPageClient({ survey }: Props) {
  let SurveyForm = null;

  try {
    const DynamicSurvey = dynamic(() => import(`@/components/surveys/${survey.slug}`), { ssr: false });
    SurveyForm = <DynamicSurvey />;
  } catch (e) {
    if (survey.title.toLowerCase().includes("anonymous")) {
      SurveyForm = <AnonymousFeedbackForm />;
    } else {
      SurveyForm = <ContactForm />;
    }
  }

  return (
    <>
      <div className="container w-full max-w-4xl mx-auto px-4 pt-16 pb-6">
        <PostHeader
          title={survey.title}
          preview={survey.preview}
          start_date={survey.start_date}
          end_date={survey.end_date}
          status={survey.status as any}
          confidence={survey.confidence as any}
          importance={survey.importance}
          category="Survey"
          backText="Surveys"
          backHref="/surveys"
        />
        <div className="mb-6">{SurveyForm}</div>
      </div>

      {/* Expanded footer aligned and spaced tighter */}
      <div className="container max-w-4xl mx-auto px-4">
        <SiteFooter />
      </div>

      <div className="container max-w-4xl mx-auto px-4 pt-4 pb-16">
        <Citation
          title={survey.title}
          slug={survey.slug}
          start_date={survey.start_date}
          end_date={survey.end_date}
          url={`https://krisyotam.com/surveys/${survey.slug}`}
        />
        <div className="mt-4">
          <LiveClock />
        </div>
        <Footer />
      </div>
    </>
  );
}
