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
            <tr className="bg-background">
              <th className="px-4 py-2 text-left text-foreground">Certification</th>
              <th className="px-4 py-2 text-left text-foreground">Date</th>
              <th className="px-4 py-2 text-left text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {certificationsData.map((cert, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-accent/10 transition-colors duration-200 cursor-pointer"
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
                <td className="px-4 py-2 text-muted-foreground">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        cert.status === "Finished" 
                          ? "text-primary" 
                          : cert.status === "Hold" 
                            ? "text-muted-foreground" 
                            : "text-muted-foreground"
                      }`}>
                        {cert.status}
                      </span>
                      {(cert.status === "In Progress" || cert.status === "Hold") && (
                        <span className="text-xs font-medium text-muted-foreground">{cert.progress}%</span>
                      )}
                    </div>
                    {(cert.status === "In Progress" || cert.status === "Hold") && (
                      <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                        <div 
                          className={`h-full bg-primary transition-all ${
                            cert.status === "Hold" 
                              ? "opacity-70" 
                              : ""
                          }`}
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}