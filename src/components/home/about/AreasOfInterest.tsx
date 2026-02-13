"use client"

import { useState } from "react"
import { Copy, Check, CopyCheck } from "lucide-react"

const AREAS_OF_INTEREST_DATA = [
  { field: "Mathematics", subfields: ["Number Theory", "Algebraic Geometry", "Algebraic Topology", "Mathematical Logic", "Methematical Pedagogy"] },
  { field: "Physics", subfields: ["Classical Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Quantum Mechanics", "Relativity"] },
  { field: "Art History", subfields: ["Ancient Art", "Medieval Art", "Renaissance Art", "Baroque and Rococo Art", "Neoclassicism and Romanticism", "Modern Art", "Contemporary Art", "Non-Western Art", "Art Criticism", "Museum Studies"] },
  { field: "Western Philosophy", subfields: ["Ontology", "Cosmology", "Free Will", "Empiricism", "Skepticism", "Rationalism", "Aesthetics", "Formal Logic", "Symbolic Logic", "Informal Logic"] },
  { field: "Eastern Philosophy", subfields: ["Jainism", "Buddhism", "Nyaya", "Samkhya", "Confucianism", "Taoism", "Zen Buddhism", "Yogacara", "Madhyamaka"] },
  { field: "Psychology", subfields: ["Biological Psychology", "Cognitive Psychology", "Social Psychology", "Neuropsychology"] },
  { field: "Literature", subfields: ["Greek Literature", "Roman Literature", "Victorian Literature", "Romantic Literature", "Elizabethan Literature", "Essays", "Poetry"] },
  { field: "Linguistics", subfields: ["Phonetics", "Phonology", "Morphology", "Syntax", "Semantics", "Pragmatics", "Psycholinguistics"] },
  { field: "Philology", subfields: ["Chinese Philology (Mandarin, Cantonese)", "Japanese Philology", "German Philology (German, Dutch, English)", "Romance Philology (French, Spanish, Italian, Portuguese)"] },
  { field: "Pedagogy", subfields: ["Teaching Methods", "Learning Theories", "Progressivism", "Charlotte Mason", "Montessori Method", "Reggio Emilia Approach", "Inclusive Education", "Behavior Management", "Andragogy"] },
  { field: "Classical Pedagogy", subfields: ["Narration", "Encomium", "Comparison & Contradiction", "Rhetoric (Ethos, Pathos, Logos)", "Panegyric", "Refutation", "Quadrivium (Arithmetic, Geometry, Music, Astronomy)", "Trivium (Grammar, Logic, Rhetoric)"] }
]

export default function AreasOfInterest() {
  const [copiedRow, setCopiedRow] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  
  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (index !== undefined) {
        setCopiedRow(index);
        setTimeout(() => setCopiedRow(null), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    });
  };
  
  const copyAllToClipboard = () => {
    const allText = AREAS_OF_INTEREST_DATA.map(area =>
      `${area.field}: ${area.subfields.join(", ")}`
    ).join("\n");

    copyToClipboard(allText);
  };
  
  const copyRowToClipboard = (area: any, index: number) => {
    const rowText = `${area.field}: ${area.subfields.join(", ")}`;
    copyToClipboard(rowText, index);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg text-muted-foreground font-light">
          Areas of academic and personal interest that I actively study, research, and explore.
        </p>
        <button
          onClick={copyAllToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 border border-border transition-colors"
          title="Copy all areas of interest"
        >
          {copiedAll ? (
            <>
              <Check size={14} className="text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyCheck size={14} />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Field</th>
              <th className="px-4 py-2 text-left text-foreground">Subfields</th>
              <th className="px-4 py-2 w-20 text-center text-foreground">Copy</th>
            </tr>
          </thead>
          <tbody>
            {AREAS_OF_INTEREST_DATA.map((area, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">{area.field}</td>
                <td className="px-4 py-2 text-muted-foreground">{area.subfields.join(", ")}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => copyRowToClipboard(area, index)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                    title={`Copy ${area.field} and its subfields`}
                  >
                    {copiedRow === index ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-muted-foreground" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}