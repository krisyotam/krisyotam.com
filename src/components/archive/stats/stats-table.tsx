"use client"

import Link from "next/link"
import { Box } from "@/components/typography/box"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sample data - this will be replaced with real data from the Redis cache
const postsData = [
  { title: "On Myself", views: 5432, path: "/blog/2025/on-myself" },
  { title: "The Nature of Consciousness", views: 4321, path: "/essays/nature-of-consciousness" },
  { title: "Understanding Quantum Computing", views: 3876, path: "/papers/quantum-computing" },
  { title: "Digital Privacy in 2025", views: 3254, path: "/notes/digital-privacy-2025" },
  { title: "The Future of AI Regulation", views: 2987, path: "/blog/2025/ai-regulation" },
]

const referrerData = [
  { source: "Google", visits: 7654 },
  { source: "Twitter", visits: 3452 },
  { source: "Hacker News", visits: 2543 },
  { source: "Reddit", visits: 1987 },
  { source: "GitHub", visits: 1432 },
]

const citiesData = [
  { city: "San Francisco, US", visits: 3245 },
  { city: "New York, US", visits: 2876 },
  { city: "London, UK", visits: 1987 },
  { city: "Tokyo, JP", visits: 1654 },
  { city: "Berlin, DE", visits: 1432 },
]

interface Post {
  title: string;
  views: number;
  path: string;
}

interface Referrer {
  source: string;
  visits: number;
}

interface City {
  city: string;
  visits: number;
}

interface StatsTableProps {
  activeTab: "posts" | "referrers" | "cities";
  posts?: Post[];
  referrers?: Referrer[];
  cities?: City[];
}

export function StatsTable({ 
  activeTab, 
  posts = postsData, 
  referrers = referrerData,
  cities = citiesData 
}: StatsTableProps) {
  return (
    <Box className="w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {activeTab === "posts" && (
              <>
                <TableHead className="w-[70%]">Post</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </>
            )}
            {activeTab === "referrers" && (
              <>
                <TableHead className="w-[70%]">Source</TableHead>
                <TableHead className="text-right">Visits</TableHead>
              </>
            )}
            {activeTab === "cities" && (
              <>
                <TableHead className="w-[70%]">Location</TableHead>
                <TableHead className="text-right">Visits</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTab === "posts" && posts.map((post) => (
            <TableRow key={post.path}>
              <TableCell className="font-medium">
                <Link href={post.path} className="hover:underline">{post.title}</Link>
              </TableCell>
              <TableCell className="text-right">{post.views.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {activeTab === "referrers" && referrers.map((referrer) => (
            <TableRow key={referrer.source}>
              <TableCell className="font-medium">{referrer.source}</TableCell>
              <TableCell className="text-right">{referrer.visits.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {activeTab === "cities" && cities.map((city) => (
            <TableRow key={city.city}>
              <TableCell className="font-medium">{city.city}</TableCell>
              <TableCell className="text-right">{city.visits.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
