"use client";

import React from "react";
import { PageHeader } from "@/components/page-header";
import "./wants-page.css";

// Add Wants page metadata
const wantsPageData = {
  title: "Wants",
  subtitle: "Items I'm Looking to Purchase",
  date: new Date().toISOString(),
  preview: "A list of items I'm interested in purchasing if you have them available.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export function WantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title={wantsPageData.title}
          subtitle={wantsPageData.subtitle}
          date={wantsPageData.date}
          preview={wantsPageData.preview}
          status={wantsPageData.status}
          confidence={wantsPageData.confidence}
          importance={wantsPageData.importance}
        />


        <div className="now-page-content mt-8">
          {children}
        </div>
      </div>
    </div>
  );
} 