"use client"

import { useState } from "react"
import companiesData from "@/data/companies.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

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
            {companiesData.map((company, index) => (
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
                    {selectedCompany?.projects.map((project, index) => (
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