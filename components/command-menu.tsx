"use client"

import { useState, useEffect } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { 
  Home, 
  User, 
  BookOpen, 
  FileText, 
  Sun, 
  Moon, 
  List, 
  Quote, 
  Heart, 
  Presentation, 
  Users, 
  School, 
  Gift, 
  Mail, 
  Scroll, 
  Earth, 
  Clock, 
  Brain, 
  Waypoints, 
  Notebook, 
  HandCoins, 
  Bitcoin, 
  Archive, 
  Music, 
  Origami, 
  Film, 
  Newspaper, 
  StickyNote, 
  SquareLibrary, 
  Feather, 
  PenLine, 
  CircleHelp, 
  PencilRuler, 
  Tags, 
  Layers, 
  Building, 
  GraduationCap, 
  Contact, 
  CalendarDays, 
  BookMarked, 
  BookCopy, 
  Briefcase, 
  Flame, 
  Video, 
  Lightbulb, 
  Sparkles, 
  Rocket, 
  FlaskConical, 
  Landmark, 
  GalleryHorizontal, 
  HeartHandshake, 
  ShoppingCart, 
  Pencil, 
  Code, 
  HelpCircle, 
  LifeBuoy, 
  FlipHorizontal, 
  Server, 
  Paperclip,
  MonitorPlay,
  BookText,
  Coins,
  Upload,
  Laptop,
  FolderKanban,
  ClipboardEdit,
  AreaChart,
  MessageSquare,
  Link,
  Grid,
  Receipt,
  MessageSquareText
} from "lucide-react"
import { SnowEffect } from "./snow-effect"
import { useTheme } from "next-themes"

const menuItems = [
  // Primary navigation - most commonly used pages
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "Blog", path: "/blog" },
  { icon: List, label: "Categories", path: "/categories" },
  { icon: Layers, label: "Series", path: "/series" },
  { icon: HeartHandshake, label: "Supporters", path: "/supporters" },
  { icon: User, label: "About", path: "/about" },
  
  // Content sections - main site areas
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Tags, label: "Tags", path: "/tags" },
  { icon: Quote, label: "Quotes", path: "/quotes" },
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
  
  // Engagement and contact
  { icon: Gift, label: "Wishlist", path: "/wishlist" },
  { icon: Bitcoin, label: "Donate", path: "/donate" },
  { icon: Mail, label: "Contact", path: "/contact" },
  
  // Currently commented sections - activate as needed
  // { icon: Newspaper, label: "Newsletter", path: "/newsletter" },
  // { icon: PenLine, label: "My Books", path: "/mybooks" },
  // { icon: Users, label: "OCs", path: "/ocs" },
  // { icon: Presentation, label: "Keynotes", path: "/keynotes" },
  // { icon: FileText, label: "Speeches", path: "/speeches" },
  // { icon: Music, label: "Playlists", path: "/playlists" },
  // { icon: Origami, label: "Anime", path: "/anime" },
  // { icon: Film, label: "Film", path: "/film" },
  // { icon: Notebook, label: "Projects", path: "/projects" },
  // { icon: Waypoints, label: "Memory", path: "/memory" },
  // { icon: Heart, label: "Colophon", path: "/colophon" },
  
  // Additional sections found in app directory
  // { icon: CircleHelp, label: "FAQ", path: "/faq" },
  // { icon: FlaskConical, label: "Prompts", path: "/prompts" },
  // { icon: Code, label: "Scripts", path: "/scripts" },
  // { icon: GraduationCap, label: "Progymnasmata", path: "/progymnasmata" },
  // { icon: Paperclip, label: "Resources", path: "/resources" },
  // { icon: Coins, label: "Research Bounties", path: "/researchbounties" },
  // { icon: AreaChart, label: "Predictions", path: "/predictions" },
  // { icon: User, label: "Profile", path: "/profile" },
  // { icon: Landmark, label: "Companies", path: "/companies" },
  // { icon: Link, label: "Sources", path: "/sources" },
  // { icon: Sparkles, label: "Auction", path: "/auction" },
  // { icon: BookCopy, label: "Books", path: "/books" },
  // { icon: GalleryHorizontal, label: "Art", path: "/art" },
  // { icon: FileText, label: "CV", path: "/cv" },
  // { icon: Grid, label: "Grid", path: "/grid" },
  // { icon: MonitorPlay, label: "Videos", path: "/videos" },
  // { icon: Receipt, label: "Changelog", path: "/changelog" },
  // { icon: Briefcase, label: "Directory", path: "/directory" },
  // { icon: BookText, label: "Reading Log", path: "/readinglog" },
  // { icon: FolderKanban, label: "Flashcards", path: "/flashcards" },
  // { icon: MessageSquare, label: "Category", path: "/category" },
  // { icon: Upload, label: "RSS", path: "/rss.xml" },
  // { icon: Laptop, label: "Website", path: "/website" },
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
        className="fixed bottom-5 right-5 bg-background w-[42px] h-[42px] rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] hover:bg-accent focus:outline-none text-[13px] font-mono border border-border flex items-center justify-center"
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

