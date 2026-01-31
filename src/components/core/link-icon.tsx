import React from "react";

interface LinkIconProps {
  href: string;
  className?: string;
}

// Icons data embedded directly - no JSON file needed
export const ICONS_DATA = [
  { slug: "adjust-solid", svg: "adjust-solid.svg" },
  { slug: "alcor", svg: "alcor.svg" },
  { slug: "alphabet", svg: "alphabet.svg" },
  { slug: "amazon", svg: "amazon.svg" },
  { slug: "angle-right-regular", svg: "angle-right-regular.svg" },
  { slug: "anthropic", svg: "anthropic.svg" },
  { slug: "apple", svg: "apple.svg" },
  { slug: "archive", svg: "archive.svg" },
  { slug: "arrow-down-right", svg: "arrow-down-right.svg" },
  { slug: "arrow-down", svg: "arrow-down.svg" },
  { slug: "arrow-hook-left", svg: "arrow-hook-left.svg" },
  { slug: "arrow-right", svg: "arrow-right.svg" },
  { slug: "arrow-up-left", svg: "arrow-up-left.svg" },
  { slug: "arrow-up-to-line-light", svg: "arrow-up-to-line-light.svg" },
  { slug: "arrow-up", svg: "arrow-up.svg" },
  { slug: "arrows-maximize-solid", svg: "arrows-maximize-solid.svg" },
  { slug: "arrows-pointing-inwards-to-dot", svg: "arrows-pointing-inwards-to-dot.svg" },
  { slug: "atlas-obscura", svg: "atlas-obscura.svg" },
  { slug: "audio-waveform-lines", svg: "audio-waveform-lines.svg" },
  { slug: "audio", svg: "audio.svg" },
  { slug: "bibliography", svg: "bibliography.svg" },
  { slug: "bitcoin", svg: "bitcoin.svg" },
  { slug: "book-open-regular", svg: "book-open-regular.svg" },
  { slug: "book-open-solid", svg: "book-open-solid.svg" },
  { slug: "book-with-gear", svg: "book-with-gear.svg" },
  { slug: "bracket-square-left-sharp-light", svg: "bracket-square-left-sharp-light.svg" },
  { slug: "bracket-square-right-sharp-light", svg: "bracket-square-right-sharp-light.svg" },
  { slug: "caduceus", svg: "caduceus.svg" },
  { slug: "cbs", svg: "cbs.svg" },
  { slug: "chevron-down-regular", svg: "chevron-down-regular.svg" },
  { slug: "chevron-left-solid", svg: "chevron-left-solid.svg" },
  { slug: "chevron-right-solid", svg: "chevron-right-solid.svg" },
  { slug: "chi-dna", svg: "chi-dna.svg" },
  { slug: "chicago-tribune", svg: "chicago-tribune.svg" },
  { slug: "circle-check-solid", svg: "circle-check-solid.svg" },
  { slug: "circle-notch-light", svg: "circle-notch-light.svg" },
  { slug: "circle-notch-solid", svg: "circle-notch-solid.svg" },
  { slug: "cochrane-collaboration", svg: "cochrane-collaboration.svg" },
  { slug: "code", svg: "code.svg" },
  { slug: "compress-solid", svg: "compress-solid.svg" },
  { slug: "connected-papers", svg: "connected-papers.svg" },
  { slug: "copy-regular", svg: "copy-regular.svg" },
  { slug: "creative-commons", svg: "creative-commons.svg" },
  { slug: "csv", svg: "csv.svg" },
  { slug: "darcs", svg: "darcs.svg" },
  { slug: "deepmind", svg: "deepmind.svg" },
  { slug: "deepseek", svg: "deepseek.svg" },
  { slug: "distillpub", svg: "distillpub.svg" },
  { slug: "dropbox", svg: "dropbox.svg" },
  { slug: "econlib", svg: "econlib.svg" },
  { slug: "eleutherai", svg: "eleutherai.svg" },
  { slug: "emacs", svg: "emacs.svg" },
  { slug: "erowid", svg: "erowid.svg" },
  { slug: "expand-arrows-down-left", svg: "expand-arrows-down-left.svg" },
  { slug: "expand-arrows-down-right", svg: "expand-arrows-down-right.svg" },
  { slug: "expand-arrows-down", svg: "expand-arrows-down.svg" },
  { slug: "expand-arrows-left", svg: "expand-arrows-left.svg" },
  { slug: "expand-arrows-right", svg: "expand-arrows-right.svg" },
  { slug: "expand-arrows-up-left", svg: "expand-arrows-up-left.svg" },
  { slug: "expand-arrows-up-right", svg: "expand-arrows-up-right.svg" },
  { slug: "expand-arrows-up", svg: "expand-arrows-up.svg" },
  { slug: "eye-slash-regular", svg: "eye-slash-regular.svg" },
  { slug: "eye-slash-solid", svg: "eye-slash-solid.svg" },
  { slug: "facebook", svg: "facebook.svg" },
  { slug: "file-video", svg: "file-video.svg" },
  { slug: "gear-solid", svg: "gear-solid.svg" },
  { slug: "github", svg: "github.svg" },
  { slug: "google-scholar", svg: "google-scholar.svg" },
  { slug: "gwern", svg: "gwern.svg" },
  { slug: "hacker-news", svg: "hacker-news.svg" },
  { slug: "hand-point-right-regular", svg: "hand-point-right-regular.svg" },
  { slug: "hoover-institution", svg: "hoover-institution.svg" },
  { slug: "icons", svg: "icons.svg" },
  { slug: "image", svg: "image.svg" },
  { slug: "info-circle-regular", svg: "info-circle-regular.svg" },
  { slug: "internet-archive", svg: "internet-archive.svg" },
  { slug: "laion", svg: "laion.svg" },
  { slug: "lastfm", svg: "lastfm.svg" },
  { slug: "link-simple-solid", svg: "link-simple-solid.svg" },
  { slug: "maggie-appleton", svg: "maggie-appleton.svg" },
  { slug: "magnifying-glass-plus-light", svg: "magnifying-glass-plus-light.svg" },
  { slug: "magnifying-glass", svg: "magnifying-glass.svg" },
  { slug: "manicule-left", svg: "manicule-left.svg" },
  { slug: "manicule-right", svg: "manicule-right.svg" },
  { slug: "mega", svg: "mega.svg" },
  { slug: "message-lines-solid", svg: "message-lines-solid.svg" },
  { slug: "message-slash-solid", svg: "message-slash-solid.svg" },
  { slug: "metaculus", svg: "metaculus.svg" },
  { slug: "midjourney", svg: "midjourney.svg" },
  { slug: "miri", svg: "miri.svg" },
  { slug: "misc", svg: "misc.svg" },
  { slug: "moon-solid", svg: "moon-solid.svg" },
  { slug: "nasa", svg: "nasa.svg" },
  { slug: "nautilus", svg: "nautilus.svg" },
  { slug: "new-york-times", svg: "new-york-times.svg" },
  { slug: "nlm-ncbi", svg: "nlm-ncbi.svg" },
  { slug: "open-philanthropy", svg: "open-philanthropy.svg" },
  { slug: "openai", svg: "openai.svg" },
  { slug: "patreon", svg: "patreon.svg" },
  { slug: "pdf", svg: "pdf.svg" },
  { slug: "plos", svg: "plos.svg" },
  { slug: "qobuz", svg: "qobuz.svg" },
  { slug: "quanta", svg: "quanta.svg" },
  { slug: "question-solid", svg: "question-solid.svg" },
  { slug: "question", svg: "question.svg" },
  { slug: "raven", svg: "raven.svg" },
  { slug: "reddit", svg: "reddit.svg" },
  { slug: "robot", svg: "robot.svg" },
  { slug: "scholarpedia", svg: "scholarpedia.svg" },
  { slug: "skull-crossbones-solid", svg: "skull-crossbones-solid.svg" },
  { slug: "sourceforge", svg: "sourceforge.svg" },
  { slug: "spinner-regular", svg: "spinner-regular.svg" },
  { slug: "spinner-third-light", svg: "spinner-third-light.svg" },
  { slug: "spotify", svg: "spotify.svg" },
  { slug: "spreadsheet", svg: "spreadsheet.svg" },
  { slug: "springerlink", svg: "springerlink.svg" },
  { slug: "stack-exchange", svg: "stack-exchange.svg" },
  { slug: "stat-news", svg: "stat-news.svg" },
  { slug: "substack", svg: "substack.svg" },
  { slug: "sun-solid", svg: "sun-solid.svg" },
  { slug: "tensorflow", svg: "tensorflow.svg" },
  { slug: "tex", svg: "tex.svg" },
  { slug: "the-guardian", svg: "the-guardian.svg" },
  { slug: "the-information", svg: "the-information.svg" },
  { slug: "the-new-yorker", svg: "the-new-yorker.svg" },
  { slug: "the-onion", svg: "the-onion.svg" },
  { slug: "the-pirate-bay", svg: "the-pirate-bay.svg" },
  { slug: "the-telegraph", svg: "the-telegraph.svg" },
  { slug: "thisisnotablankpage", svg: "thisisnotablankpage.svg" },
  { slug: "thumbtack-regular", svg: "thumbtack-regular.svg" },
  { slug: "thumbtack-solid", svg: "thumbtack-solid.svg" },
  { slug: "tidal", svg: "tidal.svg" },
  { slug: "tiktok", svg: "tiktok.svg" },
  { slug: "times-square-light", svg: "times-square-light.svg" },
  { slug: "triangle-exclamation-regular", svg: "triangle-exclamation-regular.svg" },
  { slug: "tumblr", svg: "tumblr.svg" },
  { slug: "twitter", svg: "twitter.svg" },
  { slug: "txt", svg: "txt.svg" },
  { slug: "upton-tea", svg: "upton-tea.svg" },
  { slug: "video", svg: "video.svg" },
  { slug: "wandb", svg: "wandb.svg" },
  { slug: "washington-post", svg: "washington-post.svg" },
  { slug: "wikipedia", svg: "wikipedia.svg" },
  { slug: "window-close", svg: "window-close.svg" },
  { slug: "window-maximize", svg: "window-maximize.svg" },
  { slug: "window-minimize", svg: "window-minimize.svg" },
  { slug: "wired", svg: "wired.svg" },
  { slug: "word-doc", svg: "word-doc.svg" },
  { slug: "worldcat", svg: "worldcat.svg" },
  { slug: "xmark-regular", svg: "xmark-regular.svg" },
  { slug: "youtube", svg: "youtube.svg" },
  { slug: "yud", svg: "yud.svg" },
  { slug: "goodreads", svg: "goodreads.svg" },
  { slug: "arena", svg: "arena.svg" },
  { slug: "krisyotam", svg: "krisyotam.png" },
] as const;

// Build a quick lookup from slug -> svg filename
const ICON_MAP: Record<string, string> = {};
for (const it of ICONS_DATA) {
  if (it?.slug && it?.svg) ICON_MAP[it.slug] = it.svg;
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
  "krisyotam.com": "krisyotam",
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
        src={`/fonts/icons/${svg}`}
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
