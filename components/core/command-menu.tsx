"use client"

import { useState, useEffect } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import {
  Home, User, BookOpen, FileText, Sun, Moon, List, Quote, Heart, Presentation, Users, School, Gift, Mail, Scroll,
  Earth, Clock, Brain, Waypoints, Notebook, HandCoins, Bitcoin, Archive, Music, Origami, Film, Newspaper, StickyNote,
  SquareLibrary, Feather, PenLine, CircleHelp, PencilRuler, Tags, Layers, Building, GraduationCap, Contact,
  CalendarDays, BookMarked, BookCopy, Briefcase, Flame, Video, Lightbulb, Sparkles, Rocket, FlaskConical, Landmark,
  GalleryHorizontal, HeartHandshake, ShoppingCart, Pencil, Code, HelpCircle, LifeBuoy, FlipHorizontal, Server,
  Paperclip, MonitorPlay, BookText, Coins, Upload, Laptop, FolderKanban, ClipboardEdit, AreaChart, MessageSquare,
  Link, Grid, Receipt, MessageSquareText, Tag, Gamepad2, Clapperboard, Gavel, Star, Hammer, Footprints, PenBox, BookDashed, Shapes, UserSquare, BrainCircuit,
  GlobeLock, BoxSelect, TestTube2, FileBarChart2, Files, Megaphone, BookOpenCheck, ScrollText, BookOpenText, FileEdit, PencilLine, Wrench, Pen, HelpingHand, Keyboard, Palette,
  Sigma,
  DraftingCompass,
  CassetteTape,
  FileArchive,
  ScanEye,
  NotebookPen,
  FilePen
} from "lucide-react";


import { SnowEffect } from "../snow-effect"
import { useTheme } from "next-themes"

const menuItems = [
  // Primary navigation - most commonly used pages
  { icon: Home, label: "Home", path: "/" },
  { icon: FileText, label: "Papers", path: "/papers" },
  { icon: FilePen, label: "Essays", path: "/essays" },
  { icon: NotebookPen, label: "Blog Posts", path: "/blog" },
  { icon: PenBox, label: "Reviews", path: "/reviews" },
  { icon: PenBox, label: "Fiction", path: "/fiction" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: CassetteTape, label: "Cases", path: "/cases" },
  { icon: FileArchive, label: "Dossiers", path: "/dossiers" },
  { icon: ScanEye, label: "Conspiracies", path: "/conspiracies" },
  { icon: ScrollText, label: "Libers", path: "/libers" },
  { icon: Sigma, label: "Proofs", path: "/proofs" },
  { icon: DraftingCompass, label: "problems", path: "/problems" },
  { icon: Quote, label: "Quotes", path: "/quotes" },
  { icon: List, label: "Categories", path: "/categories" },
  { icon: Tag, label: "Tags", path: "/tags" },
  { icon: Layers, label: "Series", path: "/series" },
  { icon: HeartHandshake, label: "Supporters", path: "/supporters" },
  { icon: User, label: "About", path: "/notes/on-myself/about-kris" },

  // Content sections - main site areas
  { icon: Feather, label: "Verse", path: "/verse" },
  { icon: MessageSquareText, label: "Social", path: "/social" },
  { icon: BookMarked, label: "Reading", path: "/reading" },
  { icon: Clock, label: "Now", path: "/now" },

  // Research and knowledge
  { icon: School, label: "Research", path: "/research" },
  { icon: Brain, label: "Today I Learned", path: "/til" },
  { icon: SquareLibrary, label: "Library", path: "/library" },
  { icon: Earth, label: "Globe", path: "/globe" },
  { icon: Archive, label: "Archive", path: "/archive" },
  { icon: AreaChart, label: "Stats", path: "/stats" },
  { icon: BookOpenCheck, label: "Lecture Notes", path: "/lecture-notes" },
  { icon: TestTube2, label: "Prompts", path: "/prompts" },

  // Media and entertainment
  { icon: Film, label: "Film", path: "/film" },
  { icon: BookOpenText, label: "Manga", path: "/manga" },
  { icon: Clapperboard, label: "Anime", path: "/anime" },
  { icon: Gamepad2, label: "Games", path: "/games" },
  { icon: Video, label: "Videos", path: "/videos" },

  // Personal projects & documents
  { icon: GraduationCap, label: "CV", path: "/cv" },
  { icon: FileEdit, label: "Changelog", path: "/changelog" },
  { icon: Footprints, label: "Colophon", path: "/colophon" },
  { icon: Users, label: "Profile", path: "/profile" },
  { icon: Music, label: "Playlists", path: "/playlists" },

  // Creation and expression
  { icon: PencilLine, label: "Progymnasmata", path: "/progymnasmata" },
  { icon: Palette, label: "Art", path: "/art" },
  { icon: UserSquare, label: "OCs", path: "/ocs" },
  { icon: Keyboard, label: "Type", path: "/type" },

  // Engagement and contact
  { icon: Gift, label: "Wishlist", path: "https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share" },
  { icon: Bitcoin, label: "Donate", path: "/donate" },
  { icon: Mail, label: "Contact", path: "/contact" },
  { icon: Newspaper, label: "Newsletter", path: "/newsletter" },

  // Infrastructure
  { icon: FileText, label: "RSS", path: "/rss.xml" },
  { icon: Wrench, label: "Scripts", path: "/scripts" },
  { icon: Building, label: "Companies", path: "/companies" },
  { icon: Users, label: "Sources", path: "/sources" },

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

