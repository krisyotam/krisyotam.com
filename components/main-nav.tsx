import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/essays"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/essays" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Essays
        </Link>
        <Link
          href="/categories"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/categories" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Categories
        </Link>
        <Link
          href="/series"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/series" || pathname.startsWith("/series/")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Series
        </Link>
        <Link
          href="/supporters"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/supporters" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Supporters
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/about" ? "text-foreground" : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    </div>
  )
} 