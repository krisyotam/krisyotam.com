"use client"

import { useState } from "react"
import readingLog from "@/data/reading/readinglog.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageHeader } from "@/components/page-header"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export const dynamic = "force-dynamic"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884"]

export default function ReadingLogPage() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const genreData = Object.values(
    readingLog.reduce((acc, session) => {
      if (!acc[session.genre]) {
        acc[session.genre] = { name: session.genre, pages: 0 }
      }
      acc[session.genre].pages += session.pages_read
      return acc
    }, {} as Record<string, { name: string; pages: number }>),
  )

  const authorData = Object.values(
    readingLog.reduce((acc, session) => {
      if (!acc[session.author]) {
        acc[session.author] = { name: session.author, pages: 0 }
      }
      acc[session.author].pages += session.pages_read
      return acc
    }, {} as Record<string, { name: string; pages: number }>),
  )

  const pagesByDateData = Object.values(
    readingLog.reduce((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = { date: session.date, pages: 0 }
      }
      acc[session.date].pages += session.pages_read
      return acc
    }, {} as Record<string, { date: string; pages: number }>),
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 pt-24 md:p-16 md:pt-32 lg:p-24 lg:pt-40">
        <PageHeader
          title="Reading Log"
          subtitle="tracking my reading sessions across books, articles, and essays."
          date={new Date().toISOString()}
          preview="a more robust version is available via my storygraph charts"
          status="In Progress"
          confidence="certain"
          importance={3}
        />

        <div className="flex justify-center space-x-4 my-8">
          <Button
            variant={viewMode === "chart" ? "default" : "secondary"}
            onClick={() => setViewMode("chart")}
          >
            Chart View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "secondary"}
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
        </div>

        {viewMode === "chart" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pages Per Day Line Chart */}
            <Card className="bg-muted/50 hover:bg-muted/70 transition-colors col-span-1 md:col-span-2">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Pages Read Per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pagesByDateData}>
                    <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 12 }} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pages" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Genre Pie Chart */}
            <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Most Read Genres</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      dataKey="pages"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {genreData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Author Bar Chart */}
            <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Most Read Authors</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={authorData}>
                    <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="pages" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-2 text-left text-foreground">Date</th>
                  <th className="px-4 py-2 text-left text-foreground">Title</th>
                  <th className="px-4 py-2 text-left text-foreground">Author</th>
                  <th className="px-4 py-2 text-left text-foreground">Pages</th>
                  <th className="px-4 py-2 text-left text-foreground">Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {readingLog.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedSession(session)}
                  >
                    <td className="px-4 py-2 text-foreground">{session.date}</td>
                    <td className="px-4 py-2 text-foreground">{session.title}</td>
                    <td className="px-4 py-2 text-foreground">{session.author}</td>
                    <td className="px-4 py-2 text-foreground">{session.pages_read}</td>
                    <td className="px-4 py-2 text-foreground">{session.time_spent_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Dialog for Expanded Session */}
            <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{selectedSession?.title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
                  {selectedSession && (
                    <div className="space-y-4">
                      <p><strong>Date:</strong> {selectedSession.date}</p>
                      <p><strong>Author:</strong> {selectedSession.author}</p>
                      <p><strong>Type:</strong> {selectedSession.type}</p>
                      <p><strong>Genre:</strong> {selectedSession.genre}</p>
                      <p><strong>Pages Read:</strong> {selectedSession.pages_read}</p>
                      <p><strong>Time Spent:</strong> {selectedSession.time_spent_minutes} minutes</p>
                      <p><strong>Source:</strong> {selectedSession.source}</p>
                      <p><strong>Notes:</strong> {selectedSession.notes}</p>
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}
