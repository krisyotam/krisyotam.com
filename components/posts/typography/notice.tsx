"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bot, Info, AlertCircle, ChevronRight, BrainCog } from 'lucide-react';

interface NoticeProps {
  type: 'deprecated' | 'ai' | 'warning' | 'info' | 'pending';
  children?: React.ReactNode;
}

// Notice content types
const noticeContents = {
  deprecated: {
    title: 'Deprecated Content',
    message: 'The code or features discussed in this post are no longer up to date or available.',
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-300'
  },
  pending: {
    title: 'Pending Activation',
    message: 'This opportunity is not currently active but will be available in the future. You can bookmark this page, and check back periodically.',
    icon: AlertCircle,
    className: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/30 dark:border-purple-800/50 dark:text-purple-300'
  },
  ai: {
    title: 'AI-Generated Content',
    message: 'This post was crafted by Kelex, our AI assistant, to deliver fast, fact-driven insights. I feed Kelex the exact specification documents—often PDFs straight from the source—to ensure every detail is accurate. I then proofread each report for clarity and tone. When you need clear, timely analysis—whether it’s software updates or new hardware comparisons—Kelex provides the data precisely and without delay.',
    icon: BrainCog,
    className: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800/50 dark:text-blue-300'
  },
  warning: {
    title: 'Warning',
    message: 'This content contains important warnings or considerations to be aware of.',
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800/50 dark:text-red-300'
  },
  info: {
    title: 'Info',
    message: 'Additional information that may be helpful to know.',
    icon: Info,
    className: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800/50 dark:text-green-300'
  }
};

export function Notice({ type, children }: NoticeProps) {
  // Default to info type if type is not found
  const noticeType = noticeContents[type] || noticeContents.info;
  const { title, message, icon: IconComponent, className } = noticeType;
  const [isOpen, setIsOpen] = useState(false);
  const content = children || message;

  return (
    <div className={cn(
      "my-4 border shadow-sm",
      className
    )}>
      {/* Header/Title bar with icon and dropdown arrow */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-1.5 text-left select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <IconComponent size={14} className="flex-shrink-0" />
          <span className="text-xs font-semibold">{title}</span>
        </div>
        <ChevronRight
          className={cn(
            "w-3 h-3 transform transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>

      {/* Content area */}
      <div 
        className={cn(
          "px-3 py-2 text-xs leading-snug border-t",
          !isOpen && "hidden"
        )}
      >
        {content}
      </div>
    </div>
  );
}

// Default export to allow importing as a whole component
export default Notice;