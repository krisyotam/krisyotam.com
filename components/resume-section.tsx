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
  technologies: string[];
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
          if ('organization' in item && 'location' in item && 'startDate' in item && 'endDate' in item) {
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

          if ('category' in item && 'skills' in item) {
            return (
              <div key={item.category}>
                <h4 className="font-medium">{item.category}</h4>
                <p className="text-xs text-muted-foreground">{item.skills.join(", ")}</p>
              </div>
            )
          }

          if ('technologies' in item && 'date' in item) {
            return (
              <ResumeItem
                key={item.title}
                title={item.title}
                organization={item.technologies.join(", ")}
                startDate={item.date}
                description={item.description}
                highlights={item.highlights}
              />
            )
          }

          if ('issuer' in item && 'date' in item) {
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
        return items.map((item, index) => {
          if ('technologies' in item && 'date' in item) {
            return (
              <ResumeItem
                key={index}
                title={item.title}
                organization={item.technologies.join(", ")}
                startDate={item.date}
                description={item.description}
                highlights={item.highlights}
              />
            )
          }
          return null
        })
      case "Certifications":
        return items.map((item, index) => {
          if ('issuer' in item && 'date' in item) {
            return (
              <ResumeItem
                key={index}
                title={item.title}
                organization={item.issuer}
                startDate={item.date}
                description={item.description}
              />
            )
          }
          return null
        })
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

