"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

const COMPANIES_DATA = [
  {
    company: "Kris Yotam Tutoring",
    specialties: ["Mathematical Logic", "Elemetary Algebra", "Calculus I-III"],
    status: "building",
    description: "M is a cutting-edge mathematical research firm that specializes in abstract and theoretical branches of mathematics. They focus on complex problems in number theory, algebraic geometry, and mathematical logic. Their mission is to advance mathematical understanding and its applications in various industries. M collaborates with universities and research institutions to solve some of the most challenging puzzles in mathematics and has published several papers in high-impact journals.",
    website: "https://www.mmath.com",
    projects: [
      "Developing Mathematical Foundations Course",
      "Developing Course Sequences & Teaching Structure for Integral and Differential Calculus"
    ],
    date_started: "2025"
  },
  {
    company: "Ivory Tower",
    specialties: ["Nonprofit", "Book Club", "Classics"],
    status: "building",
    description: "Quantum Physics Solutions is a forward-thinking company focused on applying quantum mechanics, electromagnetism, and relativity to solve real-world problems. They are in the process of developing new quantum computing models and systems with the potential to revolutionize multiple industries, including healthcare, energy, and telecommunications. Their research seeks to create more efficient algorithms and computational methods that take advantage of quantum properties to solve problems previously thought unsolvable.",
    website: "https://www.quantumphysics.com",
    projects: [
      "Development of Quantum Computers for Medical Applications",
      "Electromagnetic Energy Harvesting Project"
    ],
    date_started: "2025"
  },
  {
    company: "Wisteria",
    specialties: ["Web Design", "Web Development", "CLI & GUI Applications", "Minimalism"],
    status: "ideation",
    description: "Kris Yotam Tutoring is an educational company that combines traditional tutoring methods with a focus on modern art and museum studies. They offer unique, creative learning experiences that integrate the world of art into mathematics and other subjects. Their goal is to inspire students to think critically and creatively by combining the logical structure of mathematics with the imaginative world of art and cultural studies.",
    website: "https://www.krisyotamtutoring.com",
    projects: [
      "Art in Math: A New Curriculum for Students",
      "Museum Studies Course Development"
    ],
    date_started: "2025"
  },
  {
    company: "Lael Corporation",
    specialties: ["Herbal Medicine", "Therapeutics", "Natural Healing"],
    status: "inactive",
    description: "FutureTech Innovations is a tech startup focused on the development of next-generation technologies, including artificial intelligence, robotics, and quantum computing. Although currently inactive, the company has a vision to innovate and disrupt various industries, including manufacturing, healthcare, and logistics. They aim to create autonomous systems that can significantly improve efficiency and productivity in complex environments, once the company resumes operations.",
    website: "https://www.laelcorp.com",
    projects: [
      "AI-powered Manufacturing Systems",
      "Development of Autonomous Robots for Healthcare"
    ],
    date_started: "2024"
  }
]

export default function Companies() {
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  return (
    <div className="py-4">
      <div className="mb-6">
        <p className="text-lg text-muted-foreground font-light">
          Below is a list of companies I own and operate. Each company is marked with a status indicator:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>
              <strong>Active:</strong> Companies that are fully operational and growing.
            </span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            <span>
              <strong>Building:</strong> Companies in the development and construction phase.
            </span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>
              <strong>Ideation:</strong> Companies in the early concept and planning stage.
            </span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
            <span>
              <strong>Inactive:</strong> Companies that are currently on hold or dormant.
            </span>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Company</th>
              <th className="px-4 py-2 text-left text-foreground">Specialties</th>
              <th className="px-4 py-2 text-left text-foreground">Founded</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES_DATA.map((company, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <td className="px-4 py-2 text-foreground">
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        company.status === "active"
                          ? "bg-green-500"
                          : company.status === "building"
                            ? "bg-orange-500"
                            : company.status === "ideation"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                      }`}
                    ></span>
                    {company.company}
                  </div>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{company.specialties.join(", ")}</td>
                <td className="px-4 py-2 text-muted-foreground">{company.date_started}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.company}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
            <div className="space-y-6">
              <div className="flex items-center">
                <span
                  className={`inline-block w-4 h-4 rounded-full mr-2 ${
                    selectedCompany?.status === "active"
                      ? "bg-green-500"
                      : selectedCompany?.status === "building"
                        ? "bg-orange-500"
                        : selectedCompany?.status === "ideation"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                  }`}
                ></span>
                <span className="capitalize font-medium">{selectedCompany?.status}</span>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{selectedCompany?.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Projects</h3>
                  <ul className="list-disc list-inside">
                    {selectedCompany?.projects.map((project: string, index: number) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Founded</h3>
                  <p>{selectedCompany?.date_started}</p>
                </CardContent>
              </Card>

              {selectedCompany?.website && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Website</h3>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedCompany.website}
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
} 