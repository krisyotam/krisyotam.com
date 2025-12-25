import React from "react";
import iconsData from "@/data/icons/icons.json";

interface LinkIconProps {
  href: string;
  className?: string;
}

// Build a quick lookup from slug -> svg filename
const ICON_MAP: Record<string, string> = {};
if ((iconsData as any)?.icons) {
  for (const it of (iconsData as any).icons) {
    if (it?.slug && it?.svg) ICON_MAP[it.slug] = it.svg;
  }
}

// Small extension -> icon slug map
const EXT_ICON_MAP: Record<string, string> = {
  ".pdf": "pdf",
  ".epub": "epub",
  ".zip": "archive",
  ".tar": "archive",
  ".xz": "archive",
  ".png": "image",
  ".jpg": "image",
  ".jpeg": "image",
  ".gif": "image",
  ".mp4": "video",
  ".webm": "video",
  ".mp3": "audio",
  ".wav": "audio",
  ".csv": "csv",
  ".txt": "txt",
  ".doc": "word-doc",
  ".docx": "word-doc",
};

// Domain keyword mapping
const DOMAIN_ICON_MAP: Record<string, string> = {
  "wikipedia.org": "wikipedia",
  "youtube.com": "youtube",
  "youtu.be": "youtube",
  "amazon.com": "amazon",
  "github.com": "github",
  "deepmind": "deepmind",
  "openai": "openai",
  "spotify": "spotify",
  "reddit.com": "reddit",
  "twitter.com": "twitter",
  "nytimes.com": "new-york-times",
  "arxiv.org": "pdf",
  "goodreads": "goodreads",
};

function findIconForHref(href: string): { slug: string | null; svg?: string | null } {
  if (!href) return { slug: null };

  let url: URL | null = null;
  try {
    url = new URL(href, "http://example");
  } catch {
    url = null;
  }

  if (url) {
    const path = url.pathname || "";
    for (const ext of Object.keys(EXT_ICON_MAP)) {
      if (path.toLowerCase().endsWith(ext)) {
        const slug = EXT_ICON_MAP[ext];
        return { slug, svg: ICON_MAP[slug] ?? null };
      }
    }

    const hostname = url.hostname || "";
    for (const domainKey of Object.keys(DOMAIN_ICON_MAP)) {
      if (hostname.endsWith(domainKey) || hostname.includes(domainKey)) {
        const slug = DOMAIN_ICON_MAP[domainKey];
        return { slug, svg: ICON_MAP[slug] ?? null };
      }
    }
  }

  const lower = href.toLowerCase();
  for (const domainKey of Object.keys(DOMAIN_ICON_MAP)) {
    if (lower.includes(domainKey)) {
      const slug = DOMAIN_ICON_MAP[domainKey];
      return { slug, svg: ICON_MAP[slug] ?? null };
    }
  }

  // Final fallback: check if the href contains any known icon slug (so we can demo arbitrary icons)
  for (const slug of Object.keys(ICON_MAP)) {
    if (lower.includes(slug)) {
      return { slug, svg: ICON_MAP[slug] ?? null };
    }
  }

  return { slug: null };
}

export function LinkIcon({ href, className = "" }: LinkIconProps) {
  const { slug, svg } = findIconForHref(href);
  if (!slug || !svg) return null;

  // Positioning: unchanged, because it was finally correct
  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    marginLeft: "0.03em",
    position: "relative",
    top: "-0.45em",
    lineHeight: 1,
    verticalAlign: "baseline",
  };

  const imgStyle: React.CSSProperties = {
    display: "block",
    width: "0.8em",
    height: "0.8em",
    objectFit: "contain",
  };

  return (
    <span className={className} style={wrapperStyle} aria-hidden>
      <img
        src={`/icons/${svg}`}
        alt=""
        style={imgStyle}
        loading="lazy"
        className="
          link-icon-img
          opacity-90
          dark:invert
          dark:opacity-80
        "
      />
    </span>
  );
}

export default LinkIcon;
