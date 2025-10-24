import React from "react";
import FilmWatchedPage from "@/components/film/film-watched-page";
import { FilmTabs } from "@/components/film/film-tabs";
import { PageHeader } from "@/components/page-header";

export default function WatchedPage() {
  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader 
          title="Watched Films" 
          preview="A list of all the films you have watched, filtered by genre and decade."
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          description="Explore your watched films, filter by genre and decade, and relive your favorite moments."
          status="Published"
          importance={8}
          confidence="certain"
        />
        
        <FilmTabs>
          <FilmWatchedPage />
        </FilmTabs>
      </div>
    </div>
  );
}