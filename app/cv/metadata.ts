import { Metadata } from 'next'
import { cv } from '@/data/cv'

export const metadata: Metadata = {
  title: `${cv.name} - ${cv.title}`,
  description: cv.summary,
} 