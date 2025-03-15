import { cn } from "@/lib/utils"
import { Scroll, Github, Twitter, Mail } from "lucide-react"

interface BentoFooterProps {
  className?: string
}

export function BentoFooter({ className }: BentoFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="w-full flex justify-center mt-16">
      <div className={cn("max-w-3xl border-t border-border pt-4 w-full font-serif", className)}>
        <div className="py-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {/* Copyright */}
            <div className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center">
              <span className="text-muted-foreground font-serif">© {currentYear}</span>
            </div>

            {/* About */}
            <a
              href="/about"
              className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                <Scroll className="h-3 w-3" />
                <span>Colophon</span>
              </span>
            </a>

            {/* Colophon */}
            <a
              href="/colophon"
              className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                <Scroll className="h-3 w-3" />
                <span>About</span>
              </span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/krisyotam"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </span>
            </a>

            {/* Twitter */}
            <a
              href="https://x.com/krisyotam"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                <Twitter className="h-3 w-3" />
                <span>Twitter</span>
              </span>
            </a>

            {/* Contact */}
            <a
              href="/contact"
              className="bg-card border border-border hover:bg-secondary/50 transition-colors p-3 flex items-center justify-center group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>Contact</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BentoFooter

