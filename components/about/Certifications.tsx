"use client"

import { useState } from "react"
import certificationsData from "@/data/certifications.json"
import Link from "next/link"

export default function Certifications() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Professional certifications and credentials obtained throughout my career.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Certification</th>
              <th className="px-4 py-2 text-left text-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {certificationsData.map((cert, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => window.open(cert.link, "_blank")}
              >
                <td className="px-4 py-2 text-foreground">
                  <Link
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-no-preview="true"
                    className="hover:text-gray-400 transition-colors"
                  >
                    {cert.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {new Date(cert.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 