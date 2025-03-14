import { cn } from "@/lib/utils"

interface BentoFooterProps {
  className?: string
}

export function BentoFooter({ className }: BentoFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="w-full flex justify-center mt-16">
      <div className={cn("max-w-3xl border-t border-border pt-4 w-full", className)}>
        <div className="py-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <span className="text-muted-foreground">© {currentYear}</span>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BentoFooter

