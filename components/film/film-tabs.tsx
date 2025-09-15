"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, List, Users, Eye } from "lucide-react"

interface FilmTabsProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: "Overview",
    href: "/film",
    icon: Film,
    description: "Stats, activity and favorites"
  },
  {
    name: "Watched",
    href: "/film/watched",
    icon: Eye,
    description: "All movies you've watched"
  },
  {
    name: "Lists",
    href: "/film/lists", 
    icon: List,
    description: "Custom movie and TV lists"
  },
  {
    name: "Socials",
    href: "/film/socials",
    icon: Users,
    description: "Film social profiles"
  }
]

export function FilmTabs({ children }: FilmTabsProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon
            
            // Dynamically fetch data for the 'Watched' tab
            if (tab.name === "Watched" && isActive) {
              console.log("Fetching data for the Watched tab...");
            }

            return (
              <Link
                key={tab.name}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  )
}
