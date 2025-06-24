interface QuoteCardProps {
  text: string
  date: string
  category: string
  source: string
}

export function QuoteCard({ text, date, category, source }: QuoteCardProps) {
  return (
    <div className="group pl-8">
      <blockquote className="relative">
        <p className="text-2xl font-light leading-relaxed mb-4 text-foreground">{text}</p>
        <div className="flex items-center text-sm text-muted-foreground font-light space-x-3">
          <time>{date}</time>
          <span>•</span>
          <span>{category}</span>
          <span>•</span>
          <span>{source}</span>
        </div>
      </blockquote>
    </div>
  )
}

