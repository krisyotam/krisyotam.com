import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-2xl font-medium mb-2">404 - Not Found</h1>
      <p className="text-muted-foreground mb-6">The social post you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/social">Return to Social Posts</Link>
      </Button>
    </div>
  )
} 