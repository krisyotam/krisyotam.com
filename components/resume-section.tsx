import { ResumeItem } from "@/components/resume-item"

interface BaseResumeItem {
  title: string;
  description?: string;
  highlights?: string[];
}

interface ExperienceItem extends BaseResumeItem {
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface SkillCategory {
  category: string;
  skills: string[];
}

interface ProjectItem extends BaseResumeItem {
  technologies: string;
  date: string;
}

interface CertificationItem extends BaseResumeItem {
  issuer: string;
  date: string;
}

type ResumeItem = ExperienceItem | SkillCategory | ProjectItem | CertificationItem;

interface ResumeSectionProps {
  title: string;
  items: ResumeItem[];
}

export function ResumeSection({ title, items }: ResumeSectionProps) {
  // Handle different item types based on section
  const renderItems = () => {
    switch (title) {
      case "Experience":
      case "Education":
        return items.map((item) => {
          if (item.type === "experience") {
            return (
              <ResumeItem
                key={item.title}
                title={item.title}
                organization={item.organization}
                location={item.location}
                startDate={item.startDate}
                endDate={item.endDate}
                description={item.description}
                highlights={item.highlights}
              />
            )
          }

          if (item.type === "skill") {
            return (
              <div key={item.category}>
                <h4 className="font-medium">{item.category}</h4>
                <p className="text-xs text-muted-foreground">{item.skills.join(", ")}</p>
              </div>
            )
          }

          if (item.type === "technology") {
            return (
              <ResumeItem
                key={item.title}
                title={item.title}
                organization={item.technologies}
                startDate={item.date}
                description={item.description}
                highlights={item.highlights}
              />
            )
          }

          if (item.type === "certification") {
            return (
              <ResumeItem
                key={item.title}
                title={item.title}
                organization={item.issuer}
                startDate={item.date}
                description={item.description}
                highlights={item.highlights}
              />
            )
          }

          return null
        })
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

