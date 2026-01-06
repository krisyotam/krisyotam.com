/**
 * ============================================================================
 * Profile Page
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: page.tsx
 * Description: Dating-app style profile page displaying personal information,
 *              photos, and Q&A sections in a modern card-based layout.
 * ============================================================================
 */

import Image from "next/image";
import {
  Cake,
  User2,
  GraduationCap,
  Book,
  Home,
  Building2,
  Languages,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = staticMetadata.profile;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ImageItem {
  src: string;
  alt: string;
}

interface ProfileItem {
  type: "image" | "bio" | "qAndA";
  subtype?: "image1x1" | "image2x2" | "image1x2" | "image3x3" | "image3x2";
  hierarchy: number;
  src?: string;
  alt?: string;
  images?: ImageItem[];
  birthday?: string;
  gender?: string;
  height?: string;
  job?: string;
  school?: string;
  religiousAffiliation?: string;
  city?: string;
  languages?: string[];
  searchingFor?: string;
  question?: string;
  answer?: string;
  answers?: string[];
}

// ============================================================================
// PROFILE DATA
// ============================================================================

const PROFILE_DATA: ProfileItem[] = [
  {
    type: "image",
    subtype: "image1x1",
    hierarchy: 1,
    src: "/placeholder.svg?height=800&width=800",
    alt: "Profile photo",
  },
  {
    type: "bio",
    hierarchy: 2,
    birthday: "1995-05-15",
    gender: "Man",
    height: "5'11\"",
    job: "Software Engineer at Offline",
    school: "Indiana University",
    religiousAffiliation: "Agnostic",
    city: "Naperville, IL",
    languages: ["English", "Hebrew"],
    searchingFor: "Looking for something serious",
  },
  {
    type: "qAndA",
    hierarchy: 3,
    question: "I get along best with people who",
    answer:
      "Are passionate about technology and innovation, enjoy meaningful conversations, and appreciate both logic and creativity.",
  },
  {
    type: "qAndA",
    hierarchy: 4,
    question: "A life goal of mine",
    answer:
      "To contribute to groundbreaking AI research while maintaining a healthy work-life balance and continuing to learn and grow every day.",
  },
  {
    type: "image",
    subtype: "image2x2",
    hierarchy: 5,
    images: [
      { src: "/placeholder.svg?height=400&width=400", alt: "Hobby photo 1" },
      { src: "/placeholder.svg?height=400&width=400", alt: "Hobby photo 2" },
      { src: "/placeholder.svg?height=400&width=400", alt: "Hobby photo 3" },
      { src: "/placeholder.svg?height=400&width=400", alt: "Hobby photo 4" },
    ],
  },
  {
    type: "qAndA",
    hierarchy: 6,
    question: "My most irrational fear",
    answer:
      "That my code will somehow become sentient and decide to take over the world. I've watched too many sci-fi movies!",
  },
  {
    type: "image",
    subtype: "image1x2",
    hierarchy: 7,
    images: [
      { src: "/placeholder.svg?height=800&width=400", alt: "Travel photo 1" },
      { src: "/placeholder.svg?height=400&width=400", alt: "Travel photo 2" },
      { src: "/placeholder.svg?height=400&width=400", alt: "Travel photo 3" },
    ],
  },
  {
    type: "qAndA",
    hierarchy: 8,
    question: "A quick rant about",
    answer:
      "The overuse of unnecessary acronyms in tech. YAGNI, DRY, SOLID, KISS... it's like we're speaking in code even when we're not coding! Let's just communicate clearly, folks!",
  },
  {
    type: "qAndA",
    hierarchy: 9,
    question: "A random fact I love is",
    answer:
      "The world's largest desert is actually in Antarctica. It's called the Antarctic Desert and it covers 5.5 million square miles. Deserts aren't always hot and sandy!",
  },
  {
    type: "image",
    subtype: "image3x3",
    hierarchy: 10,
    images: [
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 1" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 2" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 3" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 4" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 5" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 6" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 7" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 8" },
      { src: "/placeholder.svg?height=266&width=266", alt: "Hobby 9" },
    ],
  },
  {
    type: "qAndA",
    hierarchy: 11,
    question: "An overshare",
    answer:
      "I once spent an entire weekend debugging a program, only to realize the issue was a misplaced semicolon. I may have cried a little... tears of joy, of course!",
  },
  {
    type: "qAndA",
    hierarchy: 12,
    question: "Believe it or not, I",
    answer:
      "Once accidentally set off the fire alarm in my college dorm while trying to make a grilled cheese sandwich with an iron. Let's just say my cooking skills have improved since then!",
  },
  {
    type: "image",
    subtype: "image3x2",
    hierarchy: 13,
    images: [
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 1" },
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 2" },
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 3" },
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 4" },
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 5" },
      { src: "/placeholder.svg?height=266&width=400", alt: "Travel 6" },
    ],
  },
  {
    type: "qAndA",
    hierarchy: 14,
    question: "First round is on me if",
    answer:
      "You can explain the halting problem in a way that my non-tech friends would understand. Bonus points if you can do it without using the words 'algorithm' or 'computation'!",
  },
  {
    type: "qAndA",
    hierarchy: 15,
    question: "How to pronounce my name",
    answer:
      "It's Kris (like 'crisp' without the 'p') Yo-tam (rhymes with 'go ham'). But honestly, as long as you're friendly, I don't mind if you mispronounce it!",
  },
  {
    type: "qAndA",
    hierarchy: 16,
    question: "Two truths and a lie",
    answers: [
      "I've climbed Mount Kilimanjaro.",
      "I once won a hot dog eating contest.",
      "I can solve a Rubik's cube in under 2 minutes.",
    ],
  },
  {
    type: "qAndA",
    hierarchy: 17,
    question: "My top 3 favorite programming languages",
    answers: [
      "Python - for its simplicity and versatility",
      "JavaScript - because it's the language of the web",
      "Rust - for its performance and safety features",
    ],
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate age from birthday string
 */
function calculateAge(birthday: string): number {
  return new Date().getFullYear() - new Date(birthday).getFullYear();
}

// ============================================================================
// RENDER COMPONENTS
// ============================================================================

/**
 * Render a single profile image (1x1)
 */
function ProfileImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-square relative rounded-3xl overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

/**
 * Render a 2x2 image grid
 */
function ImageGrid2x2({ images }: { images: ImageItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 aspect-square">
      {images.map((image, index) => (
        <div key={index} className="relative rounded-xl overflow-hidden">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/**
 * Render a 1x2 image layout (one large, two small)
 */
function ImageGrid1x2({ images }: { images: ImageItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 aspect-square">
      <div className="relative rounded-xl overflow-hidden">
        <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
      </div>
      <div className="grid grid-rows-2 gap-2">
        <div className="relative rounded-xl overflow-hidden">
          <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

/**
 * Render a 3x3 image grid
 */
function ImageGrid3x3({ images }: { images: ImageItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 aspect-square">
      {images.map((image, index) => (
        <div key={index} className="relative rounded-xl overflow-hidden">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/**
 * Render a 3x2 image grid
 */
function ImageGrid3x2({ images }: { images: ImageItem[] }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[3/2]">
      {images.map((image, index) => (
        <div key={index} className="relative rounded-xl overflow-hidden">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/**
 * Render bio card with personal details
 */
function BioCard({ item }: { item: ProfileItem }) {
  const bioRows = [
    { icon: Building2, text: item.job },
    { icon: GraduationCap, text: item.school },
    { icon: Book, text: item.religiousAffiliation },
    { icon: Home, text: item.city },
    { icon: Languages, text: item.languages?.join(", ") },
    { icon: Search, text: item.searchingFor },
  ];

  return (
    <Card className="p-4 space-y-4">
      {/* Quick Stats Row */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Cake className="w-5 h-5" />
          <span>{item.birthday ? calculateAge(item.birthday) : ""}</span>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2 flex-1 justify-center">
          <User2 className="w-5 h-5" />
          <span>{item.gender}</span>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span>{item.height}</span>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-4 divide-y">
        {bioRows.map((row, index) => (
          <div key={index} className="flex items-center py-3">
            <div className="w-8 flex-shrink-0">
              <row.icon className="w-5 h-5 text-gray-600" />
            </div>
            <span className="flex-grow">{row.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Render Q&A card
 */
function QAndACard({ item }: { item: ProfileItem }) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">{item.question}</h3>
      {item.answer && <p className="text-gray-600">{item.answer}</p>}
      {item.answers && (
        <div className="space-y-3 mt-2">
          {item.answers.map((answer, index) => (
            <p key={index} className="text-gray-600">
              {answer}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// ITEM RENDERER
// ============================================================================

/**
 * Render a profile item based on its type
 */
function ProfileItemRenderer({ item }: { item: ProfileItem }) {
  switch (item.type) {
    case "image":
      return renderImageItem(item);
    case "bio":
      return <BioCard item={item} />;
    case "qAndA":
      return <QAndACard item={item} />;
    default:
      return null;
  }
}

/**
 * Render image item based on subtype
 */
function renderImageItem(item: ProfileItem) {
  switch (item.subtype) {
    case "image1x1":
      return <ProfileImage src={item.src || "/placeholder.svg"} alt={item.alt || ""} />;
    case "image2x2":
      return item.images ? <ImageGrid2x2 images={item.images} /> : null;
    case "image1x2":
      return item.images ? <ImageGrid1x2 images={item.images} /> : null;
    case "image3x3":
      return item.images ? <ImageGrid3x3 images={item.images} /> : null;
    case "image3x2":
      return item.images ? <ImageGrid3x2 images={item.images} /> : null;
    default:
      return null;
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const sortedData = [...PROFILE_DATA].sort((a, b) => a.hierarchy - b.hierarchy);

  return (
    <div className="max-w-2xl mx-auto p-4 pt-20">
      <div className="space-y-6">
        {sortedData.map((item, index) => (
          <div key={index}>
            <ProfileItemRenderer item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
