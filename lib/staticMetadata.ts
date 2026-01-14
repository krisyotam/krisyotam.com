import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

/**
 * Centralized metadata for top-level pages
 * Usage:
 * import { staticMetadata } from '@/lib/staticMetadata'
 * export const metadata = staticMetadata.pageName
 */
export const staticMetadata: Record<string, Metadata> = {
  anime: {
    title: 'Anime',
    description: 'Anime reviews, recommendations, and analysis.',
    openGraph: {
      title: 'Anime',
      description: 'Anime reviews, recommendations, and analysis.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Anime'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Anime',
      description: 'Anime reviews, recommendations, and analysis.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  art: {
    title: 'Art',
    description: 'Art, illustrations, and visual creative work.',
    openGraph: {
      title: 'Art',
      description: 'Art, illustrations, and visual creative work.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Art'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Art',
      description: 'Art, illustrations, and visual creative work.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },


  cases: {
    title: 'Cases',
    description: 'Case studies and detailed examinations of specific topics.',
    openGraph: {
      title: 'Cases',
      description: 'Case studies and detailed examinations of specific topics.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Cases'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cases',
      description: 'Case studies and detailed examinations of specific topics.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  categories: {
    title: 'Categories',
    description: 'Browse content by category and subject area.',
    openGraph: {
      title: 'Categories',
      description: 'Browse content by category and subject area.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Categories'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Categories',
      description: 'Browse content by category and subject area.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  category: {
    title: 'Category',
    description: 'View content in a specific category.',
    openGraph: {
      title: 'Category',
      description: 'View content in a specific category.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Category'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Category',
      description: 'View content in a specific category.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  changelog: {
    title: 'Changelog',
    description: 'Updates and changes to this website and associated projects.',
    openGraph: {
      title: 'Changelog',
      description: 'Updates and changes to this website and associated projects.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Changelog'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Changelog',
      description: 'Updates and changes to this website and associated projects.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  companies: {
    title: 'Companies',
    description: 'Companies and organizations I\'ve worked with or founded.',
    openGraph: {
      title: 'Companies',
      description: 'Companies and organizations I\'ve worked with or founded.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Companies'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Companies',
      description: 'Companies and organizations I\'ve worked with or founded.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  conspiracies: {
    title: 'Conspiracies',
    description: 'Analysis of conspiracy theories and unusual beliefs.',
    openGraph: {
      title: 'Conspiracies',
      description: 'Analysis of conspiracy theories and unusual beliefs.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Conspiracies'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Conspiracies',
      description: 'Analysis of conspiracy theories and unusual beliefs.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Kris Yotam.',
    openGraph: {
      title: 'Contact',
      description: 'Get in touch with Kris Yotam.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Contact'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact',
      description: 'Get in touch with Kris Yotam.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  cv: {
    title: 'CV',
    description: 'Curriculum Vitae and professional history.',
    openGraph: {
      title: 'CV',
      description: 'Curriculum Vitae and professional history.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'CV'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CV',
      description: 'Curriculum Vitae and professional history.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  directory: {
    title: 'Directory',
    description: 'A complete directory of content on this site.',
    openGraph: {
      title: 'Directory',
      description: 'A complete directory of content on this site.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Directory'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Directory',
      description: 'A complete directory of content on this site.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  dossiers: {
    title: 'Dossiers',
    description: 'Comprehensive collections of information on specific topics.',
    openGraph: {
      title: 'Dossiers',
      description: 'Comprehensive collections of information on specific topics.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Dossiers'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dossiers',
      description: 'Comprehensive collections of information on specific topics.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  faq: {
    title: 'FAQ',
    description: 'Frequently asked questions and answers.',
    openGraph: {
      title: 'FAQ',
      description: 'Frequently asked questions and answers.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'FAQ'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FAQ',
      description: 'Frequently asked questions and answers.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  favs: {
    title: 'Favorites',
    description: 'My favorite content, recommendations, and collections.',
    openGraph: {
      title: 'Favorites',
      description: 'My favorite content, recommendations, and collections.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Favorites'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Favorites',
      description: 'My favorite content, recommendations, and collections.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  fiction: {
    title: 'Fiction',
    description: 'Fiction writing, stories, and narrative content.',
    openGraph: {
      title: 'Fiction',
      description: 'Fiction writing, stories, and narrative content.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Fiction'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Fiction',
      description: 'Fiction writing, stories, and narrative content.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  film: {
    title: 'Film',
    description: 'Film reviews, analysis, and recommendations.',
    openGraph: {
      title: 'Film',
      description: 'Film reviews, analysis, and recommendations.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Film'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Film',
      description: 'Film reviews, analysis, and recommendations.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  games: {
    title: 'Games',
    description: 'Video games, board games, and interactive media.',
    openGraph: {
      title: 'Games',
      description: 'Video games, board games, and interactive media.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Games'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Games',
      description: 'Video games, board games, and interactive media.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  globe: {
    title: 'Globe',
    description: 'Interactive globe visualization of content.',
    openGraph: {
      title: 'Globe',
      description: 'Interactive globe visualization of content.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Globe'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Globe',
      description: 'Interactive globe visualization of content.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  home: {
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@krisyotam'
    }
  },
  lab: {
    title: 'Lab',
    description: 'Experimental projects and works in progress.',
    openGraph: {
      title: 'Lab',
      description: 'Experimental projects and works in progress.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Lab'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lab',
      description: 'Experimental projects and works in progress.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  'lecture-notes': {
    title: 'Lecture Notes',
    description: 'Misc thoughts, proto-essays, reviews, musings, etc.',
    openGraph: {
      title: 'Lecture Notes',
      description: 'Misc thoughts, proto-essays, reviews, musings, etc.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Lecture Notes'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lecture Notes',
      description: 'Notes and summaries from lectures and presentations.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  lectures: {
    title: 'Lectures',
    description: 'Lectures and educational content.',
    openGraph: {
      title: 'Lectures',
      description: 'Lectures and educational content.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Lectures'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lectures',
      description: 'Lectures and educational content.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  legal: {
    title: 'Legal',
    description: 'Legal information, terms of service, and privacy policy.',
    openGraph: {
      title: 'Legal',
      description: 'Legal information, terms of service, and privacy policy.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Legal'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Legal',
      description: 'Legal information, terms of service, and privacy policy.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  libers: {
    title: 'Libers',
    description: 'Collected book-like content and structured learning materials.',
    openGraph: {
      title: 'Libers',
      description: 'Collected book-like content and structured learning materials.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Libers'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Libers',
      description: 'Collected book-like content and structured learning materials.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  links: {
    title: 'Links',
    description: 'Curated links to interesting resources around the web.',
    openGraph: {
      title: 'Links',
      description: 'Curated links to interesting resources around the web.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Links'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Links',
      description: 'Curated links to interesting resources around the web.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  manga: {
    title: 'Manga',
    description: 'Manga reviews, recommendations, and analysis.',
    openGraph: {
      title: 'Manga',
      description: 'Manga reviews, recommendations, and analysis.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Manga'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Manga',
      description: 'Manga reviews, recommendations, and analysis.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  mitzvah: {
    title: 'Mitzvah',
    description: 'Projects and efforts focused on doing good in the world.',
    openGraph: {
      title: 'Mitzvah',
      description: 'Projects and efforts focused on doing good in the world.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Mitzvah'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mitzvah',
      description: 'Projects and efforts focused on doing good in the world.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  music: {
    title: 'Music',
    description: 'Music reviews, recommendations, and playlists.',
    openGraph: {
      title: 'Music',
      description: 'Music reviews, recommendations, and playlists.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Music'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Music',
      description: 'Music reviews, recommendations, and playlists.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  news: {
    title: 'News',
    description: 'News and updates related to my work and interests.',
    openGraph: {
      title: 'News',
      description: 'News and updates related to my work and interests.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'News'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'News',
      description: 'News and updates related to my work and interests.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  notes: {
    title: 'Notes',
    description: 'Misc thoughts, proto-essays, reviews, musings, etc.',
    openGraph: {
      title: 'Notes',
      description: 'Misc thoughts, proto-essays, reviews, musings, etc.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Notes'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Notes',
      description: 'Short-form notes and quick thoughts on various topics.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  shortform: {
    title: 'Shortform',
    description: 'Twitter-style micro-posts and brief thoughts.',
    openGraph: {
      title: 'Shortform',
      description: 'Twitter-style micro-posts and brief thoughts.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Shortform'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shortform',
      description: 'Twitter-style micro-posts and brief thoughts.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  ocs: {
    title: 'OCs',
    description: 'Original characters and creative concepts.',
    openGraph: {
      title: 'OCs',
      description: 'Original characters and creative concepts.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'OCs'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'OCs',
      description: 'Original characters and creative concepts.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  papers: {
    title: 'Papers',
    description: 'stable long-form papers, studies, and self-experiments across various disciplines',
    openGraph: {
      title: 'Papers',
      description: 'stable long-form papers, studies, and self-experiments across various disciplines',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Papers'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Papers',
      description: 'Academic and research papers.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  playlists: {
    title: 'Playlists',
    description: 'Curated music and media playlists.',
    openGraph: {
      title: 'Playlists',
      description: 'Curated music and media playlists.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Playlists'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Playlists',
      description: 'Curated music and media playlists.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  predictions: {
    title: 'Predictions',
    description: 'Forecasts and predictions about the future.',
    openGraph: {
      title: 'Predictions',
      description: 'Forecasts and predictions about the future.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Predictions'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Predictions',
      description: 'Forecasts and predictions about the future.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  problems: {
    title: 'Problems',
    description: 'A collection of mathematical problems ranging from elementary to advanced topics',
    openGraph: {
      title: 'Problems',
      description: 'A collection of mathematical problems ranging from elementary to advanced topics',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Problems'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Problems',
      description: 'Interesting problems and puzzles to solve.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  profile: {
    title: 'Profile',
    description: 'Personal profile and information.',
    openGraph: {
      title: 'Profile',
      description: 'Personal profile and information.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Profile'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Profile',
      description: 'Personal profile and information.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  progymnasmata: {
    title: 'Progymnasmata',
    description: 'Rhetorical exercises and structured writing practices.',
    openGraph: {
      title: 'Progymnasmata',
      description: 'Rhetorical exercises and structured writing practices.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Progymnasmata'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Progymnasmata',
      description: 'Rhetorical exercises and structured writing practices.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },

  prompts: {
    title: 'Prompts',
    description: 'Writing prompts, AI prompts, and creative inspiration.',
    openGraph: {
      title: 'Prompts',
      description: 'Writing prompts, AI prompts, and creative inspiration.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Prompts'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Prompts',
      description: 'Writing prompts, AI prompts, and creative inspiration.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  proofs: {
    title: 'Proofs',
    description: 'Mathematical proofs and logical arguments.',
    openGraph: {
      title: 'Proofs',
      description: 'Mathematical proofs and logical arguments.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Proofs'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Proofs',
      description: 'Mathematical proofs and logical arguments.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  questions: {
    title: 'Questions',
    description: 'Thought-provoking questions and inquiries.',
    openGraph: {
      title: 'Questions',
      description: 'Thought-provoking questions and inquiries.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Questions'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Questions',
      description: 'Thought-provoking questions and inquiries.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  quotes: {
    title: 'Quotes',
    description: 'Inspiring and thought-provoking quotes.',
    openGraph: {
      title: 'Quotes',
      description: 'Inspiring and thought-provoking quotes.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Quotes'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Quotes',
      description: 'Inspiring and thought-provoking quotes.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  reading: {
    title: 'Reading',
    description: 'What I\'m currently reading and book recommendations.',
    openGraph: {
      title: 'Reading',
      description: 'What I\'m currently reading and book recommendations.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Reading'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reading',
      description: 'What I\'m currently reading and book recommendations.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  references: {
    title: 'References',
    description: 'Reference materials and useful resources.',
    openGraph: {
      title: 'References',
      description: 'Reference materials and useful resources.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'References'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'References',
      description: 'Reference materials and useful resources.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  reports: {
    title: 'Reports',
    description: 'Detailed reports on various topics and projects.',
    openGraph: {
      title: 'Reports',
      description: 'Detailed reports on various topics and projects.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Reports'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reports',
      description: 'Detailed reports on various topics and projects.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  research: {
    title: 'Research',
    description: 'My research projects and findings.',
    openGraph: {
      title: 'Research',
      description: 'My research projects and findings.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Research'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Research',
      description: 'My research projects and findings.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  researchbounties: {
    title: 'Research Bounties',
    description: 'Bounties for research projects and investigations.',
    openGraph: {
      title: 'Research Bounties',
      description: 'Bounties for research projects and investigations.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Research Bounties'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Research Bounties',
      description: 'Bounties for research projects and investigations.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  reviews: {
    title: 'Reviews',
    description: 'Reviews of books, media, products, and experiences.',
    openGraph: {
      title: 'Reviews',
      description: 'Reviews of books, media, products, and experiences.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Reviews'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reviews',
      description: 'Reviews of books, media, products, and experiences.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  'rules-of-the-internet': {
    title: 'Rules of the Internet',
    description: 'A collection of internet rules, norms, and patterns.',
    openGraph: {
      title: 'Rules of the Internet',
      description: 'A collection of internet rules, norms, and patterns.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Rules of the Internet'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Rules of the Internet',
      description: 'A collection of internet rules, norms, and patterns.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  scripts: {
    title: 'Scripts',
    description: 'Various scripts and code snippets.',
    openGraph: {
      title: 'Scripts',
      description: 'Various scripts and code snippets.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Scripts'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Scripts',
      description: 'Various scripts and code snippets.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  sequences: {
    title: 'Sequences',
    description: 'Ordered series of content on specific topics.',
    openGraph: {
      title: 'Sequences',
      description: 'Ordered series of content on specific topics.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Sequences'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sequences',
      description: 'Ordered series of content on specific topics.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  series: {
    title: 'Series',
    description: 'Content organized into connected series.',
    openGraph: {
      title: 'Series',
      description: 'Content organized into connected series.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Series'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Series',
      description: 'Content organized into connected series.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  social: {
    title: 'Social',
    description: 'Social media links and profiles.',
    openGraph: {
      title: 'Social',
      description: 'Social media links and profiles.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Social'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Social',
      description: 'Social media links and profiles.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  sources: {
    title: 'Sources',
    description: 'Source materials and references used in my work.',
    openGraph: {
      title: 'Sources',
      description: 'Source materials and references used in my work.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Sources'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sources',
      description: 'Source materials and references used in my work.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  stats: {
    title: 'Stats',
    description: 'Analytics and statistics about this website.',
    openGraph: {
      title: 'Stats',
      description: 'Analytics and statistics about this website.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Stats'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Stats',
      description: 'Analytics and statistics about this website.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  supporters: {
    title: 'Supporters',
    description: 'Those who support my work and contributions.',
    openGraph: {
      title: 'Supporters',
      description: 'Those who support my work and contributions.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Supporters'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Supporters',
      description: 'Those who support my work and contributions.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  symbols: {
    title: 'Symbols',
    description: 'Collection of symbols and their meanings.',
    openGraph: {
      title: 'Symbols',
      description: 'Collection of symbols and their meanings.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Symbols'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Symbols',
      description: 'Collection of symbols and their meanings.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  tag: {
    title: 'Tag',
    description: 'Content organized by specific tags.',
    openGraph: {
      title: 'Tag',
      description: 'Content organized by specific tags.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Tag'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tag',
      description: 'Content organized by specific tags.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  tags: {
    title: 'Tags',
    description: 'Browse content by tags and keywords.',
    openGraph: {
      title: 'Tags',
      description: 'Browse content by tags and keywords.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Tags'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tags',
      description: 'Browse content by tags and keywords.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  til: {
    title: 'Today I Learned',
    description: 'A collection of short notes from my cross-disciplinary studies, shared as I learn in public.',
    openGraph: {
      title: 'Today I Learned',
      description: 'A collection of short notes from my cross-disciplinary studies, shared as I learn in public.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Today I Learned'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Today I Learned',
      description: 'A collection of short notes from my cross-disciplinary studies, shared as I learn in public.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  type: {
    title: 'Type',
    description: 'Typography and type-related content.',
    openGraph: {
      title: 'Type',
      description: 'Typography and type-related content.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Type'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Type',
      description: 'Typography and type-related content.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  verse: {
    title: 'Verse',
    description: 'Poetry and verse-form writing.',
    openGraph: {
      title: 'Verse',
      description: 'Poetry and verse-form writing.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Verse'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Verse',
      description: 'Poetry and verse-form writing.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  videos: {
    title: 'Videos',
    description: 'Video content and presentations.',
    openGraph: {
      title: 'Videos',
      description: 'Video content and presentations.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Videos'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Videos',
      description: 'Video content and presentations.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  wishlist: {
    title: 'Wishlist',
    description: 'My current wishlist of items and experiences.',
    openGraph: {
      title: 'Wishlist',
      description: 'My current wishlist of items and experiences.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Wishlist'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wishlist',
      description: 'My current wishlist of items and experiences.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  projects: {
    title: 'Projects',
    description: 'Explore the projects Kris is working on.',
    openGraph: {
      title: 'Projects',
      description: 'Explore the projects Kris is working on.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Projects'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Projects',
      description: 'Explore the projects Kris is working on.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  essays: {
    title: 'Essays',
    description: 'personal reflections, provocations, and open-ended thinking on life and mind',
    openGraph: {
      title: 'Essays',
      description: 'personal reflections, provocations, and open-ended thinking on life and mind',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Essays'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Essays',
      description: 'Long-form essays and reflections on various topics.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  blog: {
    title: 'Blog',
    description: 'informal ramblings, thought experiments, and idea play across topics and characters',
    openGraph: {
      title: 'Blog',
      description: 'informal ramblings, thought experiments, and idea play across topics and characters',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Blog'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog',
      description: 'Short-form reflections, updates, and informal analysis.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  now: {
    title: 'Now',
    description: 'What Kris is currently focused on and working on.',
    openGraph: {
      title: 'Now',
      description: 'What Kris is currently focused on and working on.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Now Page'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Now',
      description: 'What Kris is currently focused on and working on.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  blogroll: {
    title: 'Blogroll',
    description: 'A curated list of blogs and websites Kris recommends.',
    openGraph: {
      title: 'Blogroll',
      description: 'A curated list of blogs and websites Kris recommends.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Blogroll'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blogroll',
      description: 'A curated list of blogs and websites Kris recommends.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  library: {
    title: 'Library',
    description: 'Books and references in Kris Yotam\'s collection.',
    openGraph: {
      title: 'Library',
      description: 'Books and references in Kris Yotam\'s collection.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Library'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Library',
      description: 'Books and references in Kris Yotam\'s collection.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  },
  colophon: {
    title: 'Colophon',
    description: 'Information about how this website was built and designed.',
    openGraph: {
      title: 'Colophon',
      description: 'Information about how this website was built and designed.',
      images: [
        {
          url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
          width: 1200,
          height: 630,
          alt: 'Kris Yotam Colophon'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Colophon',
      description: 'Information about how this website was built and designed.',
      images: ['https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png'],
      creator: '@krisyotam'
    }
  }
}

/**
 * Creates metadata for a page with custom title and description
 * @param title The page title
 * @param description The page description
 * @param imagePath Optional custom image path
 * @returns Metadata object
 */
export function createMetadata(title: string, description: string, imagePath?: string): Metadata {
  const imageUrl = imagePath || 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@krisyotam'
    }
  }
}
