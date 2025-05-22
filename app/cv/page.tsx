"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cv } from '@/data/cv'
import { ResumeSection } from '@/components/resume-section'
import { PageHeader } from '@/components/page-header'
import { cn } from '@/lib/utils'

export default function CVPage() {
  const [activeSection, setActiveSection] = useState('experience')

  const sections = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PageHeader
        title="Curriculum Vitae"
        description="A comprehensive overview of my professional journey, skills, and achievements."
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center space-x-4">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {section.label}
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ResumeSection
            title={sections.find((s) => s.id === activeSection)?.label || ''}
            items={
              cv[
                activeSection as keyof typeof cv
              ] as Array<{
                title: string
                organization: string
                location: string
                date: string
                description: string
                technologies?: string[]
              }>
            }
          />
        </motion.div>
      </div>
    </div>
  )
}
