import { Mail, MapPin, Phone, Globe } from "lucide-react"
import { ContactItem } from "@/components/contact-item"

interface ResumeHeaderProps {
  name: string
  title: string
  contact: {
    email: string
    phone: string
    location: string
    website?: string
  }
  summary: string
}

export function ResumeHeader({ name, title, contact, summary }: ResumeHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        <p className="text-lg text-muted-foreground">{title}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <ContactItem icon={<Mail className="h-4 w-4" />} text={contact.email} />
        <ContactItem icon={<Phone className="h-4 w-4" />} text={contact.phone} />
        <ContactItem icon={<MapPin className="h-4 w-4" />} text={contact.location} />
        {contact.website && <ContactItem icon={<Globe className="h-4 w-4" />} text={contact.website} />}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      </div>
    </header>
  )
}

