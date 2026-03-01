"use client"

import MoralsCarousel from "@/components/about/morals-carousel"

const MORALS_ASSESSMENTS_DATA = [
  {
    key: "mfq",
    label: "MFQ",
    fullName: "Moral Foundations Questionnaire",
    definition: "Measures the degree to which individuals endorse different moral foundations: care, fairness, loyalty, authority, and purity.",
    link: "/pdfs/moral-foundations-questionnaire.pdf",
    progressBars: [
      { label: "Care / Harm", value: 3.8, max: 5 },
      { label: "Fairness / Cheating", value: 4.1, max: 5 },
      { label: "Loyalty / Betrayal", value: 3.2, max: 5 },
      { label: "Authority / Subversion", value: 2.9, max: 5 },
      { label: "Purity / Degradation", value: 3.5, max: 5 },
    ],
  },
  {
    key: "mfss",
    label: "Sacredness",
    fullName: "Moral Foundations Sacredness Scale",
    definition: "Assesses how sacred or inviolable different moral values are to an individual.",
    link: "/pdfs/moral-foundations-sacredness.pdf",
    progressBars: [
      { label: "Care Sacredness", value: 4.2, max: 5 },
      { label: "Fairness Sacredness", value: 4.5, max: 5 },
      { label: "Loyalty Sacredness", value: 3.0, max: 5 },
      { label: "Authority Sacredness", value: 2.7, max: 5 },
      { label: "Purity Sacredness", value: 3.8, max: 5 },
    ],
  },
  {
    key: "epq",
    label: "EPQ",
    fullName: "Ethics Positions Questionnaire",
    definition: "Evaluates ethical ideologies along dimensions of relativism and idealism.",
    link: "/pdfs/ethics-positions-questionnaire.pdf",
    quadrantLabel: "Absolutist",
    progressBars: [
      { label: "Idealism", value: 7.2, max: 9 },
      { label: "Relativism", value: 3.8, max: 9 },
    ],
  },
  {
    key: "mis",
    label: "MIS",
    fullName: "Moral Identity Scale",
    definition: "Measures the degree to which moral traits are central to one's self-concept.",
    link: "/pdfs/moral-identity-scale.pdf",
    progressBars: [
      { label: "Internalization", value: 4.1, max: 5 },
      { label: "Symbolization", value: 2.8, max: 5 },
    ],
  },
  {
    key: "svs",
    label: "Schwartz",
    fullName: "Schwartz Value Survey",
    definition: "Identifies personal values priorities across ten universal value types.",
    link: "/pdfs/schwartz-value-survey.pdf",
    progressBars: [
      { label: "Self-Direction", value: 5.8, max: 7 },
      { label: "Universalism", value: 5.2, max: 7 },
      { label: "Benevolence", value: 4.9, max: 7 },
      { label: "Achievement", value: 4.5, max: 7 },
      { label: "Stimulation", value: 4.2, max: 7 },
      { label: "Hedonism", value: 3.8, max: 7 },
      { label: "Security", value: 3.5, max: 7 },
      { label: "Conformity", value: 3.1, max: 7 },
      { label: "Tradition", value: 2.9, max: 7 },
      { label: "Power", value: 2.4, max: 7 },
    ],
  },
  {
    key: "ds",
    label: "Disgust",
    fullName: "The Disgust Scale",
    definition: "Measures sensitivity to disgust across different domains, which correlates with certain moral judgments.",
    link: "/pdfs/disgust-scale.pdf",
    progressBars: [
      { label: "Core Disgust", value: 2.1, max: 4 },
      { label: "Animal-Reminder Disgust", value: 1.8, max: 4 },
      { label: "Contamination-Based Disgust", value: 2.5, max: 4 },
    ],
  },
  {
    key: "mrq",
    label: "M&R",
    fullName: "Morality & Relationships Questionnaire",
    definition: "Examines how moral values influence interpersonal relationships and social interactions.",
    link: "/pdfs/morality-relationships-questionnaire.pdf",
    keyValues: [
      { label: "Moral Commitment", value: "High" },
      { label: "Relational Ethics", value: "Principled" },
      { label: "Trust Orientation", value: "Conditional" },
      { label: "Fairness in Relationships", value: "Strong" },
      { label: "Loyalty Expectation", value: "Moderate" },
      { label: "Forgiveness Tendency", value: "Selective" },
    ],
  },
  {
    key: "be",
    label: "Business",
    fullName: "Business Ethics",
    definition: "Evaluates ethical decision-making in business contexts and professional environments.",
    link: "/pdfs/business-ethics.pdf",
    progressBars: [
      { label: "Stakeholder Responsibility", value: 4.3, max: 5 },
      { label: "Transparency", value: 4.6, max: 5 },
      { label: "Fair Competition", value: 3.9, max: 5 },
      { label: "Environmental Ethics", value: 4.0, max: 5 },
      { label: "Employee Welfare", value: 4.4, max: 5 },
    ],
  },
]

export default function PersonalityMorals() {
  return (
    <div className="py-4">
      <MoralsCarousel
        data={MORALS_ASSESSMENTS_DATA}
        description="Results from various moral and ethical assessments that provide insight into my value system and ethical framework."
      />
    </div>
  )
}
