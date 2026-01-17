"use client"

import { useState, useEffect } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import {
  Home, User, FileText, Sun, Moon, List, Quote, Users, Gift, Mail,
  Earth, Clock, Brain, Bitcoin, Music, Film, StickyNote,
  SquareLibrary, Feather, Layers, Building,
  BookMarked, Video, HeartHandshake,
  AreaChart, Tag, Gamepad2, Clapperboard, PenBox, UserSquare,
  BookOpenText, FileEdit, PencilLine, Keyboard, Palette,
  NotebookPen, FilePen
} from "lucide-react";


import { SnowEffect } from "../snow-effect"
import { useTheme } from "next-themes"

const menuItems = [
  // Primary navigation
  { icon: Home, label: "Home", path: "/" },
  { icon: FileText, label: "Papers", path: "/papers" },
  { icon: FilePen, label: "Essays", path: "/essays" },
  { icon: NotebookPen, label: "Blog Posts", path: "/blog" },
  { icon: PenBox, label: "Reviews", path: "/reviews" },
  { icon: PenBox, label: "Fiction", path: "/fiction" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Quote, label: "Quotes", path: "/quotes" },
  { icon: List, label: "Categories", path: "/categories" },
  { icon: Tag, label: "Tags", path: "/tags" },
  { icon: Layers, label: "Sequences", path: "/sequences" },
  { icon: HeartHandshake, label: "Supporters", path: "/supporters" },
  { icon: User, label: "About", path: "/me" },

  // Content sections
  { icon: Feather, label: "Verse", path: "/verse" },
  { icon: BookMarked, label: "Reading", path: "/reading" },
  { icon: Clock, label: "Now", path: "/now" },
  { icon: Brain, label: "Today I Learned", path: "/til" },
  { icon: PencilLine, label: "Progymnasmata", path: "/progymnasmata" },

  // Media and tracking
  { icon: Film, label: "Film", path: "/film" },
  { icon: BookOpenText, label: "Manga", path: "/manga" },
  { icon: Clapperboard, label: "Anime", path: "/anime" },
  { icon: Gamepad2, label: "Games", path: "/games" },
  { icon: Video, label: "Videos", path: "/videos" },
  { icon: SquareLibrary, label: "Library", path: "/library" },
  { icon: Earth, label: "Globe", path: "/globe" },
  { icon: Music, label: "Music", path: "/music" },

  // Creative
  { icon: Palette, label: "Art", path: "/art" },
  { icon: UserSquare, label: "OCs", path: "/ocs" },

  // Site info
  { icon: AreaChart, label: "Stats", path: "/stats" },
  { icon: FileEdit, label: "Changelog", path: "/changelog" },
  { icon: Users, label: "Profile", path: "/profile" },
  { icon: Building, label: "Companies", path: "/companies" },
  { icon: Users, label: "Sources", path: "/sources" },
  { icon: Keyboard, label: "Type", path: "/type" },

  // Engagement
  { icon: Gift, label: "Wishlist", path: "https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share" },
  { icon: Bitcoin, label: "Donate", path: "/donate" },
  { icon: Mail, label: "Contact", path: "/contact" },
  { icon: FileText, label: "RSS", path: "/rss.xml" },
];


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
          <Command.Group heading="Pages" className="px-2 py-1.5 text-xs text-gray-400 dark:text-gray-500">
            {menuItems.map((item, index) => (
              <Command.Item
                key={`${item.path}-${index}`}
                onSelect={() => runCommand(() => router.push(item.path))}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm text-gray-600 dark:text-gray-300 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <item.icon size={14} /> {item.label}
              </Command.Item>
            ))}
          </Command.Group>
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

