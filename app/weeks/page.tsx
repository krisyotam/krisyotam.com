import { PageHeader } from "@/components/page-header"
import weeksData from '@/data/weeks/weeks.json'
import WeeksClient from '@/components/weeks-client'

export const revalidate = 0

export default function WeeksPage() {
  const life = (weeksData as any).life

  return (
    <main>
      <PageHeader
        title="Weeks"
        preview="A life in weeks: one bento per week. Hover to reveal hidden notes."
        description="Track your weeks. Each year uses a different pastel color."
        backText="Home"
        backHref="/"
        className="max-w-5xl mx-auto px-4 mt-10"
      />

      <div className="max-w-5xl mx-auto px-4">
        <p className="mb-6 text-sm text-muted-foreground">Born: <time dateTime={life.born}>{life.born}</time></p>

        {/* Client-side interactive grid */}
        <WeeksClient life={life} />
      </div>
    </main>
  )
}
