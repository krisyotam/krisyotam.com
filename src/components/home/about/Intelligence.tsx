"use client"

import IntelligenceCarousel from "@/components/intelligence-carousel"

const IQ_ASSESSMENTS_DATA = {
  realIQ: {
    name: "Cattell-Horn-Carroll model",
    fullScaleIQ: 160,
    breakdown: {
      workingMemory: "High",
      fluidIntelligence: "Very High",
      processingSpeed: "High",
      logicalReasoning: "Very High",
      patternRecognition: "Very High",
      attentionToDetail: "High"
    },
    percentile: 99.4,
    description: "An online assessment based on the Cattell-Horn-Carroll model measuring fluid intelligence, working memory, and pattern recognition.",
    date: "2023-07-10",
    testLocation: "Online",
    measurementStatus: "tested",
    testNotes: "Resting state: After nap, good meal, and quiet environment. 13 minutes remaining on the test.",
    pdfs: {}
  },
  wais: {
    name: "Wechsler Adult Intelligence Scale (WAIS-IV)",
    fullScaleIQ: 138,
    breakdown: {
      verbal: 140,
      perceptualReasoning: 136,
      workingMemory: 135,
      processingSpeed: 130
    },
    percentile: 99.4,
    description: "The WAIS is one of the most widely used intelligence tests for adults, measuring cognitive ability across different domains.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ score using standard SD=15 conversion tables for high-range scores",
    pdfs: {}
  },
  stanfordBinet: {
    name: "Stanford-Binet Intelligence Scale",
    fullScaleIQ: 139,
    breakdown: {
      fluidReasoning: 142,
      knowledge: 138,
      quantitativeReasoning: 140,
      visualSpatialProcessing: 136,
      workingMemory: 137
    },
    percentile: 99.4,
    description: "The Stanford-Binet test measures five factors of cognitive ability and provides a detailed analysis of intellectual capabilities.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ score using Stanford-Binet scale conversion (SD=16)",
    pdfs: {}
  },
  ravenProgressive: {
    name: "Raven's Progressive Matrices",
    score: 35,
    maxPossibleScore: 36,
    percentile: 99.4,
    description: "A non-verbal test that measures abstract reasoning and fluid intelligence through pattern recognition.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ score; high score expected due to strong pattern recognition abilities",
    pdfs: {}
  },
  cattellCultureFair: {
    name: "Cattell Culture Fair Intelligence Test",
    iqScore: 160,
    percentile: 99.4,
    description: "Designed to measure fluid intelligence while minimizing cultural and educational biases.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ results with SD=24 scale; closely related to the RealIQ test model",
    pdfs: {}
  },
  workingMemory: {
    name: "N-Back Working Memory Assessment",
    score: "4-back 92% accuracy",
    percentile: 98.5,
    description: "Measures working memory capacity, attention control, and fluid intelligence.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ score; blog post indicates high working memory abilities",
    pdfs: {}
  },
  processingSpeed: {
    name: "Cognitive Processing Speed Index",
    score: 135,
    percentile: 99.0,
    description: "Measures the speed of mental processing and visual-motor coordination.",
    date: "2023-07-13",
    testLocation: "Estimated",
    measurementStatus: "estimated",
    conversionNotes: "Estimated from RealIQ score; blog post mentions processing speed as a component of intelligence tests",
    pdfs: {}
  }
}

export default function Intelligence() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Results from various intelligence assessments that provide insight into my cognitive abilities,
        processing speed, and problem-solving capabilities.
      </p>
      <IntelligenceCarousel data={IQ_ASSESSMENTS_DATA} />
    </div>
  )
}
