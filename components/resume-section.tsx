import { ResumeItem } from "@/components/resume-item"

interface ResumeSectionProps {
  title: string
  items: any[]
}

export function ResumeSection({ title, items }: ResumeSectionProps) {
  // Handle different item types based on section
  const renderItems = () => {
    switch (title) {
      case "Experience":
      case "Education":
        return items.map((item, index) => (
          <ResumeItem
            key={index}
            title={item.title}
            organization={item.organization}
            location={item.location}
            startDate={item.startDate}
            endDate={item.endDate}
            description={item.description}
            highlights={item.highlights}
          />
        ))
      case "Skills":
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {items.map((category, index) => (
              <div key={index} className="space-y-1">
                <h4 className="font-medium">{category.category}</h4>
                <p className="text-xs text-muted-foreground">{category.skills.join(", ")}</p>
              </div>
            ))}
          </div>
        )
      case "Projects":
        return items.map((item, index) => (
          <ResumeItem
            key={index}
            title={item.title}
            organization={item.technologies}
            startDate={item.date}
            description={item.description}
            highlights={item.highlights}
          />
        ))
      case "Certifications":
        return items.map((item, index) => (
          <ResumeItem
            key={index}
            title={item.title}
            organization={item.issuer}
            startDate={item.date}
            description={item.description}
          />
        ))
      default:
        return null
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4">{renderItems()}</div>
    </section>
  )
}

