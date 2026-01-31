// Core Components
export { PostHeader, CategoryHeader, PageHeader } from './core';
export { UniversalLinkModal, Popups } from './core/popups';

// Book Components (from posts/books)
export { default as Book } from './posts/books/book';
export { BookCard } from './posts/books/book-card';

// Content Components
export { ContentTable } from './content/table';

// Subdirectory exports
export * from './typography';
export * from './posts';
export * from './mdx';
export * from './art';
export * from './anime';
export * from './trakt';
export * from './predictions';
export * from './progymnasmata';
export * from './reading';
export * from './sequences';
export * from './stats';

// Home components
export { BentoNav } from './home/bento-nav';
export { BlogPost } from './home/blog-post';
export { FeaturedPost } from './home/featured-post';
export { WordOfTheDay } from './home/about/WordOfTheDay';
export { Favorites } from './home/about/Favorites';
export { default as SiteStickerCarousel } from './home/about/site-sticker-carousel';

// About components (from components/about)
export { default as ProfileBento } from './about/profile-bento';
export { default as PersonalityCarousel } from './about/personality-carousel';
export { default as IntelligenceCarousel } from './about/intelligence-carousel';
export { default as PersonalBio } from './about/personal-bio';
export { default as NameBreakdown } from './about/name-breakdown';
export { default as CoreSkills } from './about/core-skills';
export { default as Experience } from './about/experience';
export { Tree as FamilyTree } from './about/family-tree';

// Contact components
export { default as PGP } from './contact/pgp';

// Library components
export { LibraryTabs } from './library/library-tabs';
export { LibraryBookCard } from './library/library-book-card';
export { LibraryNotesContent } from './library/library-notes-content';
export { CatalogContent } from './library/catalog-content';

// Music components
export { CurrentlyListening } from './music/CurrentlyListening';
export { default as PlaylistList } from './music/playlist-list';
export { default as PlaylistCard } from './music/playlist-card';

// Quotes components
export { QuoteCard } from './quotes/quote-card';
export { QuoteOfTheDay } from './quotes/QuoteOfTheDay';
export { QuotesFeed } from './quotes/quotes-feed';
export { InfiniteMovingQuotes } from './quotes/InfiniteMovingQuotes';

// Companies components
export { CompaniesGrid } from './companies/companies-grid';
export { CompanyCard } from './companies/company-card';

// UI components
export { SnowEffect } from './ui/snow-effect';
export { ScrollbarController } from './ui/scrollbar-controller';
export { default as FixOutlineIssue } from './ui/fix-outline-issue';
export { HeaderUnderlineDetector } from './ui/header-underline-detector';
export { DarkModeClasses } from './ui/dark-mode-classes';
export { DarkModeScript } from './ui/dark-mode-script';
export { ThemeProvider } from './ui/theme-provider';
export { LiveClock } from './ui/live-clock';
export { HeartButton } from './ui/heart-button';

// Core components
export { Citation } from './core/citation';
export { Bibliography } from './core/bibliography';
export { default as Dropcap } from './core/dropcap';
export { Poetry } from './core/poetry';
export { default as LinkIcon } from './core/link-icon';
export { default as TimeStamp } from './core/time-stamp';
export { default as SimpleBib } from './core/simplebib';
export { Footer } from './core/footer';
export { ViewTracker } from './core/view-tracker';
export { default as RelatedPosts } from './core/related-posts';

// MDX components
export { default as TableOfContents } from './mdx/table-of-contents';
export { InternalLink } from './mdx/internal-link';
export { EnhancedLink } from './mdx/enhanced-link';
export { default as Inflation } from './mdx/inflation';
export { WebsitePreview } from './mdx/website-preview';

export { FavoriteCard as FavoriteCardComponent } from './anime';
