"use client"

import { useState } from "react"
import Link from "next/link"
import myMethodsData from "@/data/about/my-methods.json"

export default function OnMyMethod() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-lg text-muted-foreground font-light">
          A collection of evolving essays detailing my systems, processes, and philosophies on learning,
          creativity, and problem-solving.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Title</th>
              <th className="px-4 py-2 text-left text-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {myMethodsData.methods.map((item, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => (window.location.href = item.link)}
              >
                <td className="px-4 py-2 text-foreground">
                  <Link
                    href={item.link}
                    data-no-preview="true"
                    className="hover:text-gray-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 