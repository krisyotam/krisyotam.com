"use client"

interface DevContentProps {
  content: string
}

export function DevContent({ content }: DevContentProps) {
  return (
    <div className="post-content font-serif">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
