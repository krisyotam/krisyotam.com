/**
 * Home Poetry Section Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Random poetry cards display
 */

import { PoetryCard, type Poem } from "./poetry"

interface HomePoetryProps {
  randomPoems: Poem[]
}

export function HomePoetry({ randomPoems }: HomePoetryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {randomPoems.map((poem) => (
        <PoetryCard key={poem.id} poem={poem} />
      ))}
    </div>
  )
}
