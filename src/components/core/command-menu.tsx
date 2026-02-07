"use client"

import { useState, useEffect } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import {
  Home, Sun, Moon, List, Quote, Gift, Mail,
  Earth, Clock, Brain, Music, Film, StickyNote,
  SquareLibrary, Feather, Layers, User, Bitcoin,
  BookMarked, Video, HeartHandshake,
  AreaChart, Tag, Gamepad2, Clapperboard,
  BookOpenText, FileEdit, PencilLine, Keyboard, Palette,
  Rss, Users, Sparkles, ScrollText, Pen, Newspaper, Star, FileText,
  NotebookPen, TextQuote
} from "lucide-react"

import { SnowEffect } from "@/components/ui/snow-effect"
import { useTheme } from "next-themes"

// Organized menu sections
const menuSections = [
  {
    heading: "Home",
    items: [
      { icon: Home, label: "Home", path: "/" },
    ]
  },
  {
    heading: "Content",
    items: [
      { icon: ScrollText, label: "Papers", path: "/papers" },
      { icon: Pen, label: "Essays", path: "/essays" },
      { icon: Newspaper, label: "Blog", path: "/blog" },
      { icon: NotebookPen, label: "Diary", path: "/diary" },
      { icon: Star, label: "Reviews", path: "/reviews" },
      { icon: Sparkles, label: "Fiction", path: "/fiction" },
      { icon: StickyNote, label: "Notes", path: "/notes" },
      { icon: Feather, label: "Verse", path: "/verse" },
      { icon: PencilLine, label: "Progymnasmata", path: "/progymnasmata" },
      { icon: Brain, label: "Today I Learned", path: "/til" },
      { icon: Clock, label: "Now", path: "/now" },
    ]
  },
  {
    heading: "Media",
    items: [
      { icon: Film, label: "Film", path: "/film" },
      { icon: Clapperboard, label: "Anime", path: "/anime" },
      { icon: BookOpenText, label: "Manga", path: "/manga" },
      { icon: Gamepad2, label: "Games", path: "/games" },
      { icon: Music, label: "Music", path: "/music" },
      { icon: Video, label: "Videos", path: "/videos" },
      { icon: Palette, label: "Art", path: "/art" },
      { icon: Users, label: "OCs", path: "/ocs" },
    ]
  },
  {
    heading: "Reading",
    items: [
      { icon: BookMarked, label: "Reading", path: "/reading" },
      { icon: SquareLibrary, label: "Library", path: "/library" },
    ]
  },
  {
    heading: "Browse",
    items: [
      { icon: List, label: "Categories", path: "/categories" },
      { icon: Tag, label: "Tags", path: "/tags" },
      { icon: Layers, label: "Sequences", path: "/sequences" },
      { icon: Quote, label: "Quotes", path: "/quotes" },
      { icon: TextQuote, label: "Excerpts", path: "/excerpts" },
    ]
  },
  {
    heading: "Site",
    items: [
      { icon: User, label: "About", path: "/me" },
      { icon: AreaChart, label: "Stats", path: "/stats" },
      { icon: FileEdit, label: "Changelog", path: "/changelog" },
      { icon: Earth, label: "Globe", path: "/globe" },
      { icon: FileText, label: "Sources", path: "/sources" },
      { icon: Keyboard, label: "Type", path: "/type" },
    ]
  },
  {
    heading: "Connect",
    items: [
      { icon: Rss, label: "RSS", path: "/rss.xml" },
      { icon: Bitcoin, label: "Donate", path: "/donate" },
      { icon: Gift, label: "Wishlist", path: "https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share" },
      { icon: HeartHandshake, label: "Supporters", path: "/supporters" },
      { icon: Mail, label: "Contact", path: "/contact" },
    ]
  },
]

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40" />
          <SnowEffect />
        </>
      )}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-background w-[42px] h-[42px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] hover:bg-accent focus:outline-none text-[13px] font-mono border border-border flex items-center justify-center"
      >
        ⌘K
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[370px] max-h-[70vh] bg-background text-foreground rounded-xl shadow-2xl border border-border z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 py-2 border-border text-sm text-muted-foreground">
          <span>
            Chicago, US {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </span>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <Command.Input
          placeholder="Type a command or search..."
          className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 placeholder:text-muted-foreground border-border focus:outline-none text-sm bg-transparent"
        />

        <Command.List className="py-2 px-2 max-h-[50vh] overflow-y-auto">
          {menuSections.map((section) => (
            <Command.Group
              key={section.heading}
              heading={section.heading}
              className="px-2 py-1.5 text-xs text-muted-foreground uppercase tracking-wide"
            >
              {section.items.map((item, index) => (
                <Command.Item
                  key={`${item.path}-${index}`}
                  onSelect={() => runCommand(() => router.push(item.path))}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm text-gray-600 dark:text-gray-300 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <item.icon size={14} /> {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex items-center justify-between px-2 py-2 border-t border-border">
          <span className="text-sm text-muted-foreground">krisyotam@protonmail.com</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Close</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 px-1 py-0.5 border border-gray-200 dark:border-gray-600 rounded">
              ESC
            </span>
          </div>
        </div>
      </Command.Dialog>
    </>
  )
}
