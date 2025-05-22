// Core Components
export { default as TableOfContents } from './table-of-contents';
export { BlogPost } from './blog-post';
export { PostWrapper } from './post-wrapper';
export { PostHeader } from './post-header';
// export { default as PostFooter } from './post-footer'; // File missing or not a module
export { PostMap } from './post-map';
export { default as LinkTags } from './link-tags';
export type { MarginNote } from './margin-notes';
export { default as Footnotes } from './footnotes';

// Navigation Components
export { MainNav } from './main-nav';
export { MobileNav } from './mobile-nav';
// export { default as Breadcrumbs } from './breadcrumbs'; // File missing
// export { default as Pagination } from './pagination'; // File missing

// Link Components
export { InternalLink } from './internal-link';
// export { default as ExternalLink } from './external-link'; // File missing
// export { default as UniversalLink } from './universal-link'; // File missing
export { UniversalLinkModal } from './universal-link-modal';

// Book Components
export { default as Book } from './posts/books/book';
export { BookCard } from './posts/books/book-card';
export { BookList } from './book-list';
// export { MyBooksContents } from './mybooks-contents'; // File missing or no named export
export { MyBookCard } from './my-book-card';
export { MyBookList } from './my-book-list';

// Typography Components
export { default as Dropcap } from './dropcap';
export { default as Inflation } from './inflation';
export { Poetry } from './poetry';
// MarginNote already exported above
// Footnotes already exported above

// Note Components
// export { default as NoteCard } from './note-card'; // File missing
// export { default as NoteList } from './note-list'; // File missing
// export { default as NoteHeader } from './note-header'; // File missing
// export { default as NoteFooter } from './note-footer'; // File missing

// UI Components
export * from './ui';

// Content Components
export { ContentTable } from './shared/content-table';
export { CategoryHeader } from './category-header';
export { DirectoryCategoryHeader } from './directory-category-header';
export { DirectoryPageHeader } from './directory-page-header';
export { DocsHeader } from './docs/docs-header';
export { PageHeader } from './page-header';
// PostHeader already exported above
export { TagHeader } from './tag-header';
export { VerseHeader } from './verse-header';

// Newsletter Components
export { default as NewsletterCard } from './newsletter-card';
export { default as NewsletterHeader } from './newsletter-header';
export { default as NewsletterFooter } from './newsletter-footer';
export { default as NewsletterSearch } from './newsletter-search';
export { default as NewsletterYearFilter } from './newsletter-year-filter';
export { default as NewsletterViewToggle } from './newsletter-view-toggle';
export { default as NewsletterHelpModal } from './newsletter-help-modal';

// Playlist Components
export { default as PlaylistList } from './playlist-list';
export { default as PlaylistGenreFilter } from './playlist-genre-filter';
export { default as PlaylistSearch } from './playlist-search';
export { default as PlaylistCard } from './playlist-card';

// Other Components
export { default as ProfileBento } from './profile-bento';
export { default as SiteStickerCarousel } from './site-sticker-carousel';
export { default as PersonalityCarousel } from './personality-carousel';
export { default as ResourcesTable } from './resources-table';
export { default as Archive } from './archive';
export { default as PGP } from './pgp';
// export { ContactInfo } from './contact-info'; // File missing or no named export
export { default as CoreSkills } from './core-skills';
export { default as Experience } from './experience';
export { default as Wishlist } from './wishlist';
export { default as FictionWorld } from './fiction-world';
export { default as RelatedPosts } from './related-posts';

// Subdirectory exports
export * from './typography';
export * from './posts';
// export * from './references'; // Not a module
export * from './mdx';
export * from './art';
export * from './anime';
export * from './trakt';
export * from './predictions';
export * from './progymnasmata'; 