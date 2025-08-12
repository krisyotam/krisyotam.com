"use client"

interface ChangelogContentProps {
  content: string
}

export function ChangelogContent({ content }: ChangelogContentProps) {
  return (
    <div className="post-content font-serif">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

