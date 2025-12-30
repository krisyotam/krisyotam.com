"use client"

import { useState } from 'react';
import { StatsFilter } from '@/components/stats/stats-filter';
import { StatsChart } from '@/components/stats/stats-chart';
import { StatsTable } from '@/components/stats/stats-table';
import { PageHeader, PageHeaderProps, PageDescription } from '@/components/core';
import { AreaChart } from "lucide-react";

interface VisitData {
  date: string;
  total: number;
}

interface StatsRowData {
  member: string;
  total: number;
}

interface CityData {
  city: string;
  flag: string;
  total: number;
}

interface StatsPageProps {
  totalVisits: VisitData[];
  topPaths: StatsRowData[];
  topReferrers: StatsRowData[];
  topCities: CityData[];
}

export default function StatsPage({ totalVisits, topPaths, topReferrers, topCities }: StatsPageProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "referrers" | "cities">("posts");

  interface FormattedPost {
    title: string;
    views: number;
    path: string;
  }

  interface FormattedReferrer {
    source: string;
    visits: number;
  }

  interface FormattedCity {
    city: string;
    visits: number;
  }

  // Format the data for the table
  const formattedPosts: FormattedPost[] = topPaths.map(path => ({
    title: path.member.replace(/^\/+|\/+$/g, '').replace(/-/g, ' ').split('/').pop() || path.member,
    views: path.total,
    path: path.member
  }));

  const formattedReferrers: FormattedReferrer[] = topReferrers.map(referrer => ({
    source: referrer.member === '(direct)' ? 'Direct' : referrer.member,
    visits: referrer.total
  }));

  const formattedCities: FormattedCity[] = topCities.map(cityData => ({
    city: cityData.city + (cityData.flag ? ` ${cityData.flag}` : ''),
    visits: cityData.total
  }));

  // Header data for PageHeader component
  const headerData: PageHeaderProps = {
    title: "Statistics",
    preview: "Visitor statistics and analytics for krisyotam.com",
    status: "Published" as const,
    confidence: "certain" as const,
    importance: 7,
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <PageHeader {...headerData} />
      
      <PageDescription
        title="About Statistics"
        description="This page shows visitor statistics and analytics for krisyotam.com, including the most popular content, traffic sources, and geographic distribution of visitors. Data is updated daily."
      />
      
      <div className="flex flex-col items-center">
        <div className="w-full">
          <StatsChart data={totalVisits.map(v => ({ 
            date: v.date, 
            visits: v.total 
          }))} />
        </div>
        
        <div className="mt-8 w-full">
          <StatsFilter activeTab={activeTab} onChange={setActiveTab} />
          
          <div className="mt-4 w-full">
            <StatsTable 
              activeTab={activeTab}
              posts={formattedPosts}
              referrers={formattedReferrers}
              cities={formattedCities}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
