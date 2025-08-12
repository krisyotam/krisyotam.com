"use client"

import { useState } from "react"
import { Copy, Check, CopyCheck } from "lucide-react"
import areasOfInterestData from "@/data/areas-of-interest.json"

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
    const allText = areasOfInterestData.map(area => 
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
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
            {areasOfInterestData.map((area, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">{area.field}</td>
                <td className="px-4 py-2 text-muted-foreground">{area.subfields.join(", ")}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => copyRowToClipboard(area, index)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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