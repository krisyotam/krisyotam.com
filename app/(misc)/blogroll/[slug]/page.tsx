/**
 * ============================================================================
 * Blogroll Entry Page
 * ============================================================================
 * Author: Kris Yotam
 * Description: Individual blogroll entry page with iframe preview
 * Created: 2026-01-04
 * ============================================================================
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getBlogrollBySlug, type BlogrollEntry } from "@/lib/system-db";
import { UrlControls, IframeWithUrlBar } from "./client-components";
import { PostHeader } from "@/components/core";
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  params: { slug: string };
}

// ============================================================================
// Helper Functions
// ============================================================================

function getSocialInfo(url: string) {
  try {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("github.com")) {
      const username = url.split("/").pop() || "";
      return { icon: Github, platform: "GitHub", display: `@${username}`, url };
    }
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
      const username = url.split("/").pop() || "";
      return {
        icon: Twitter,
        platform: "Twitter",
        display: `@${username}`,
        url,
      };
    }
    if (lowerUrl.includes("instagram.com")) {
      const username = url.split("/").pop() || "";
      return {
        icon: Instagram,
        platform: "Instagram",
        display: `@${username}`,
        url,
      };
    }
    if (lowerUrl.includes("linkedin.com")) {
      return {
        icon: Linkedin,
        platform: "LinkedIn",
        display: "LinkedIn Profile",
        url,
      };
    }
    if (lowerUrl.includes("mastodon")) {
      const parts = url.split("@");
      const username = parts.length > 1 ? `@${parts.pop()}` : "Mastodon";
      return { icon: MessageCircle, platform: "Mastodon", display: username, url };
    }
    if (lowerUrl.startsWith("mailto:")) {
      const email = url.replace("mailto:", "");
      return { icon: Mail, platform: "Email", display: email, url };
    }
    if (lowerUrl.includes("steamcommunity.com")) {
      return { icon: Globe, platform: "Steam", display: "Steam Profile", url };
    }

    return { icon: Globe, platform: "Website", display: url, url };
  } catch (error) {
    console.warn("Error processing social URL:", url, error);
    return {
      icon: ExternalLink,
      platform: "Link",
      display: url || "Invalid URL",
      url: url || "#",
    };
  }
}

// ============================================================================
// Metadata
// ============================================================================

export function generateMetadata({ params }: PageProps): Metadata {
  const entry = getBlogrollBySlug(params.slug);
  if (!entry) {
    return { title: "Entry Not Found | Blogroll" };
  }
  return {
    title: `${entry.title} | Blogroll | Kris Yotam`,
    description: entry.description,
  };
}

// ============================================================================
// Page Component
// ============================================================================

export default function BlogrollEntryPage({ params }: PageProps) {
  const entry = getBlogrollBySlug(params.slug);
  if (!entry) notFound();

  // Extract domain name for display
  let domainName = "Unknown Site";
  try {
    if (entry.url && typeof entry.url === "string") {
      domainName = new URL(entry.url).hostname.replace(/^www\./, "");
    }
  } catch (error) {
    console.warn(`Invalid URL for entry ${entry.slug}:`, entry.url);
    domainName = entry.url || "Unknown Site";
  }

  // Default values
  const publishDate = entry.publishDate || "2023-04-01";
  const status = (entry.status || "Finished") as
    | "Abandoned"
    | "Notes"
    | "Draft"
    | "In Progress"
    | "Finished";
  const confidence = (entry.confidence || "likely") as
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain";
  const importance = parseInt(String(entry.importance)) || 7;
  const title = entry.title || "Untitled Entry";

  // Convert socials array to URL strings
  const socialUrls = entry.socials?.map((s) => s.url) || [];
  const importantUrls = entry.importantUrls?.map((u) => u.url) || [];

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Post Header */}
        <PostHeader
          title={title}
          subtitle={domainName}
          start_date={publishDate}
          end_date=""
          tags={entry.tags}
          category={entry.category}
          status={status as any}
          confidence={confidence as any}
          importance={importance}
          backText="Blogroll"
          backHref="/blogroll"
        />

        {/* Iframe with URL bar */}
        <div className="my-8">
          <IframeWithUrlBar url={entry.url} title={title} height={550} />
        </div>

        {/* Site information below the iframe */}
        <div className="mt-8 border border-border p-4 bg-card">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Site info */}
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{title}</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {entry.category}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{entry.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {entry.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium bg-muted/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* URL and controls */}
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex items-center bg-background border border-border px-3 py-2 text-sm font-mono text-muted-foreground">
                <span className="truncate max-w-[200px] md:max-w-[300px]">
                  {domainName}
                </span>
              </div>
              <UrlControls url={entry.url} />
            </div>
          </div>
        </div>

        {/* Socials and Important URLs */}
        {(socialUrls.length > 0 || importantUrls.length > 0) && (
          <div className="mt-6 space-y-6">
            {/* Social Media Links */}
            {socialUrls.length > 0 && (
              <div className="border border-border p-4 bg-card">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Social Media
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {socialUrls.map((social, index) => {
                    const {
                      icon: Icon,
                      platform,
                      display,
                      url,
                    } = getSocialInfo(social);
                    return (
                      <Link
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {platform}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {display}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Important URLs */}
            {importantUrls.length > 0 && (
              <div className="border border-border p-4 bg-card">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Important Links
                </h3>
                <div className="space-y-2">
                  {importantUrls.map((url, index) => {
                    let domain = "Unknown Domain";
                    try {
                      domain = new URL(url).hostname.replace(/^www\./, "");
                    } catch (error) {
                      console.warn("Invalid important URL:", url);
                      domain = url || "Invalid URL";
                    }
                    return (
                      <Link
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                      >
                        <Globe className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {url}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {domain}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
