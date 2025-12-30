interface NowContentProps {
  content: string
}

export function NowContent({ content }: NowContentProps) {
  return (
    <div
      className="prose dark:prose-invert max-w-none now-page-content"
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

