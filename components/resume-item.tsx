import { Badge } from "@/components/ui/badge"

interface ResumeItemProps {
  title: string
  organization?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
  highlights?: string[]
  tags?: string[]
}

export function ResumeItem({
  title,
  organization,
  location,
  startDate,
  endDate,
  description,
  highlights,
  tags,
}: ResumeItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {startDate && (
          <p className="text-xs text-muted-foreground">
            {startDate}
            {endDate ? ` - ${endDate}` : " - Present"}
          </p>
        )}
      </div>

      {(organization || location) && (
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          {organization && <p className="text-xs font-medium text-muted-foreground">{organization}</p>}
          {location && <p className="text-xs text-muted-foreground">{location}</p>}
        </div>
      )}

      {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}

      {highlights && highlights.length > 0 && (
        <ul className="ml-5 list-disc text-xs leading-relaxed text-muted-foreground">
          {highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

