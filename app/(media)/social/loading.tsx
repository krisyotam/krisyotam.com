export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  )
} 