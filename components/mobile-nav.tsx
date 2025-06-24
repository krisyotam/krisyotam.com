import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          href="/"
          className="flex items-center"
          onClick={(e) => {
            // Close the mobile menu
            document.body.classList.remove("overflow-hidden")
            document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
          }}
        >
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/essays"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/essays" ? "text-foreground" : "text-foreground/60"
              )}
              onClick={(e) => {
                // Close the mobile menu
                document.body.classList.remove("overflow-hidden")
                document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
              }}
            >
              Essays
            </Link>
            <Link
              href="/categories"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/categories"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
              onClick={(e) => {
                // Close the mobile menu
                document.body.classList.remove("overflow-hidden")
                document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
              }}
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
              onClick={(e) => {
                // Close the mobile menu
                document.body.classList.remove("overflow-hidden")
                document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
              }}
            >
              Series
            </Link>
            <Link
              href="/supporters"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/supporters" ? "text-foreground" : "text-foreground/60"
              )}
              onClick={(e) => {
                // Close the mobile menu
                document.body.classList.remove("overflow-hidden")
                document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
              }}
            >
              Supporters
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              )}
              onClick={(e) => {
                // Close the mobile menu
                document.body.classList.remove("overflow-hidden")
                document.querySelector('[data-radix-popper-content-wrapper]')?.remove()
              }}
            >
              About
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 