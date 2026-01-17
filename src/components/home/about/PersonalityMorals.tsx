"use client"

const PERSONALITY_MORALS_DATA = [
  {
    test: "Moral Foundations Questionnaire",
    definition: "Measures the degree to which individuals endorse different moral foundations: care, fairness, loyalty, authority, and purity.",
    link: "/pdfs/moral-foundations-questionnaire.pdf"
  },
  {
    test: "Moral Foundations Sacredness Scale",
    definition: "Assesses how sacred or inviolable different moral values are to an individual.",
    link: "/pdfs/moral-foundations-sacredness.pdf"
  },
  {
    test: "Ethics Positions Questionnaire",
    definition: "Evaluates ethical ideologies along dimensions of relativism and idealism.",
    link: "/pdfs/ethics-positions-questionnaire.pdf"
  },
  {
    test: "Moral Identity Scale",
    definition: "Measures the degree to which moral traits are central to one's self-concept.",
    link: "/pdfs/moral-identity-scale.pdf"
  },
  {
    test: "Schwartz Value Survey",
    definition: "Identifies personal values priorities across ten universal value types.",
    link: "/pdfs/schwartz-value-survey.pdf"
  },
  {
    test: "The Disgust Scale",
    definition: "Measures sensitivity to disgust across different domains, which correlates with certain moral judgments.",
    link: "/pdfs/disgust-scale.pdf"
  },
  {
    test: "Morality & Relationships Questionnaire",
    definition: "Examines how moral values influence interpersonal relationships and social interactions.",
    link: "/pdfs/morality-relationships-questionnaire.pdf"
  },
  {
    test: "Business Ethics",
    definition: "Evaluates ethical decision-making in business contexts and professional environments.",
    link: "/pdfs/business-ethics.pdf"
  }
]

export default function PersonalityMorals() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Results from various moral and ethical assessments that provide insight into my value system and ethical
        framework.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Assessment</th>
              <th className="px-4 py-2 text-left text-foreground">Definition</th>
            </tr>
          </thead>
          <tbody>
            {PERSONALITY_MORALS_DATA.map((item, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => window.open(item.link, "_blank")}
              >
                <td className="px-4 py-2 text-foreground">{item.test}</td>
                <td className="px-4 py-2 text-muted-foreground">{item.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 