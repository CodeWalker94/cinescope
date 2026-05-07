/**
 * ============================================================
 * TMDB GENRE CONSTANTS
 * ============================================================
 * Source: TMDB official genre IDs
 * Purpose:
 * - Keep genre logic readable
 * - Prevent “wrong shelf” titles (talk shows in sitcoms, etc.)
 */

/* =========================
   MOVIE GENRES
========================= */
export const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

/* =========================
   TV GENRES
========================= */
export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
};

/* =========================
   COMMON EXCLUSION PRESETS
========================= */

/**
 * Use this for:
 * - Sitcoms
 * - Dramas
 * - Crime
 * - Sci-Fi
 *
 * Prevents:
 * - Talk shows
 * - News
 * - Reality TV
 */
export const EXCLUDE_TV_NON_SERIES = [
  TV_GENRES.TALK,
  TV_GENRES.NEWS,
  TV_GENRES.REALITY,
  TV_GENRES.ANIMATION,
];

/**
 * Extra strict (if you need it later)
 */
export const EXCLUDE_TV_NON_FICTION = [
  TV_GENRES.TALK,
  TV_GENRES.NEWS,
  TV_GENRES.REALITY,
  TV_GENRES.DOCUMENTARY,
];

/* =========================
   HELPER (OPTIONAL)
========================= */

/**
 * Checks if a title’s PRIMARY genre matches what we expect.
 * Use this only as a final client-side safety net.
 */
export const hasPrimaryGenre = (item, genreId) => {
  if (!Array.isArray(item?.genre_ids)) return false;
  return item.genre_ids[0] === genreId;
};
// ─── Row config shape ────────────────────────────────────────────────────────
// Each row config maps 1-to-1 with a useBrowseRowData call.
// { id, title, mediaType, filter, mode, modes, minVotes }
// "filter" mirrors the useBrowseRowData filter shape:
// { includeGenreIds, excludeGenreIds, allowMixed, keywordQuery,
//   originalLanguage, yearGte, yearLte }

// ─── DASHBOARD ROWS (no genre selected) ─────────────────────────────────────

export const DASHBOARD_ROWS = {
  // ── Movies tab ──────────────────────────────────────────────────────────
  movie: [
    {
      id: "movie-trending",
      title: "Trending This Week",
      mediaType: "movie",
      filter: { excludeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "movie-top-rated",
      title: "All-Time Greats",
      mediaType: "movie",
      filter: { minRating: 7.5, excludeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 2000,
    },
    {
      id: "movie-action-adventure",
      title: "Action & Adventure",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ACTION, MOVIE_GENRES.ADVENTURE],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "movie-comedy",
      title: "Comedy & Feel-Good",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.COMEDY],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "movie-scifi-horror",
      title: "Sci-Fi & Horror",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION, MOVIE_GENRES.HORROR],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "movie-drama",
      title: "Award-Winning Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        minRating: 7.0,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
  ],

  // ── TV Shows tab ─────────────────────────────────────────────────────────
  tv: [
    {
      id: "tv-trending",
      title: "Trending This Week",
      mediaType: "tv",
      filter: {
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-top-rated",
      title: "Fan Favorites",
      mediaType: "tv",
      filter: {
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 1000,
    },
    {
      id: "tv-drama",
      title: "Binge-Worthy Drama",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "tv-crime-mystery",
      title: "Crime & Mystery",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.CRIME, TV_GENRES.MYSTERY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "tv-comedy",
      title: "Comedy",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.COMEDY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "tv-scifi",
      title: "Sci-Fi & Fantasy",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
  ],

  // ── Animation tab ────────────────────────────────────────────────────────
  animation: [
    {
      id: "dash-anim-trending-movies",
      title: "Trending Animated Movies",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "dash-anim-trending-tv",
      title: "Trending Animated Series",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.ANIMATION] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "dash-anim-top-movies",
      title: "Highest Rated Animated Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "dash-anim-family",
      title: "Family Picks",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        requireAllInclude: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "dash-anim-mature",
      title: "Mature Animation",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "en",
        certificationGte: "TV-14",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "dash-anim-superhero",
      title: "Superhero Animated Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        keywordQuery: "superhero",
        allowMixed: true,
      },
      mode: "popular",
      modes: ["popular"],
    },
    {
      id: "dash-anime-picks",
      title: "Top Anime Picks",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "dash-anim-classics",
      title: "Animated Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION],
        yearLte: 2000,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "dash-anime-films",
      title: "Anime Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
      minVotes: 200,
    },
    {
      id: "dash-anim-adventure",
      title: "Animated Adventure",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.ADVENTURE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
  ],
};

// ─── GENRE PAGE ROWS (genre tile selected) ───────────────────────────────────
// Key format: "<mediaType>:<genreId>"  e.g. "movie:28"
// Animation special keys: "movie:16", "tv:16", "tv:16:anime"

export const GENRE_ROWS = {
  // ── Animated Movies ──────────────────────────────────────────────────────
  "movie:16": [
    {
      id: "anim-movie-trending",
      title: "Trending Animated Movies",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "anim-movie-disney-pixar",
      title: "Disney & Pixar Hits",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        requireAllInclude: true,
        certificationCountry: "US",
        certificationLte: "G",
      },
      mode: "popular",
      modes: ["popular"],
      minVotes: 500,
    },
    {
      id: "anim-movie-family",
      title: "Family Animated Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "anim-movie-top-rated",
      title: "Highest Rated Animated Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ANIMATION] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 800,
    },
    {
      id: "anim-movie-classics",
      title: "Animated Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION],
        yearLte: 2000,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "anim-movie-adventure",
      title: "Animated Adventure",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.ADVENTURE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── Animated Series ───────────────────────────────────────────────────────
  "tv:16": [
    {
      id: "anim-tv-trending",
      title: "Trending Animated Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        excludeGenreIds: [TV_GENRES.KIDS],
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "anim-tv-top-rated",
      title: "Highest Rated Animated Shows",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        excludeGenreIds: [TV_GENRES.KIDS],
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
    {
      id: "anim-tv-mature",
      title: "Mature Animation",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "en",
        certificationGte: "TV-14",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "anim-tv-superhero",
      title: "Superhero Animated Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        keywordQuery: "superhero",
        allowMixed: true,
      },
      mode: "popular",
      modes: ["popular"],
    },
    {
      id: "anim-tv-comedy",
      title: "Animated Comedies",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION, TV_GENRES.COMEDY],
        allowMixed: true,
        originalLanguage: "en",
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "anim-tv-classics",
      title: "Classic Animated Shows",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        yearLte: 2005,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 100,
    },
  ],

  // ── Anime ─────────────────────────────────────────────────────────────────
  "tv:16:anime": [
    {
      id: "anime-trending",
      title: "Trending Anime",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "anime-top-rated",
      title: "Highest Rated Anime",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
    {
      id: "anime-action",
      title: "Action Anime",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION, TV_GENRES.ACTION_ADVENTURE],
        originalLanguage: "ja",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "anime-romance",
      title: "Romance & Slice of Life",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
        keywordQuery: "slice of life",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "anime-fantasy",
      title: "Fantasy & Isekai",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "anime-classics",
      title: "Classic Anime",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ANIMATION],
        originalLanguage: "ja",
        yearLte: 2010,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 100,
    },
    {
      id: "anime-movies",
      title: "Anime Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ANIMATION],
        originalLanguage: "ja",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
      minVotes: 200,
    },
  ],

  // ── Action Movies ────────────────────────────────────────────────────────
  "movie:28": [
    {
      id: "action-trending",
      title: "Trending Action",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ACTION], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "action-blockbusters",
      title: "Franchise Blockbusters",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ACTION],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        allowMixed: true,
        keywordQuery: "sequel",
      },
      mode: "popular",
      modes: ["popular"],
      minVotes: 2000,
    },
    {
      id: "action-superhero",
      title: "Superhero Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ACTION],
        keywordQuery: "superhero",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "action-top-rated",
      title: "Highest Rated Action",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ACTION], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 1000,
    },
    {
      id: "action-thrillers",
      title: "Action-Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ACTION, MOVIE_GENRES.THRILLER],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "action-classics",
      title: "Action Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ACTION],
        yearLte: 2000,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
  ],

  // ── Adventure Movies ─────────────────────────────────────────────────────
  "movie:12": [
    {
      id: "adventure-trending",
      title: "Trending Adventure",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ADVENTURE], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "adventure-epic",
      title: "Epic Journeys",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ADVENTURE],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "adventure-fantasy",
      title: "Adventure & Fantasy",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ADVENTURE, MOVIE_GENRES.FANTASY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "adventure-family",
      title: "Family Adventures",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ADVENTURE, MOVIE_GENRES.FAMILY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── Comedy Movies ────────────────────────────────────────────────────────
  "movie:35": [
    {
      id: "comedy-trending",
      title: "Trending Comedies",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.COMEDY],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "comedy-top-rated",
      title: "Critically Loved Comedies",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.COMEDY],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "comedy-romcoms",
      title: "Romantic Comedies",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.COMEDY, MOVIE_GENRES.ROMANCE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "comedy-action",
      title: "Action Comedies",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.COMEDY, MOVIE_GENRES.ACTION],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "comedy-classics",
      title: "Comedy Classics",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.COMEDY], yearLte: 2000 },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
  ],

  // ── Crime Movies ─────────────────────────────────────────────────────────
  "movie:80": [
    {
      id: "crime-trending",
      title: "Trending Crime",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.CRIME], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "crime-heist",
      title: "Heist Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.CRIME],
        keywordQuery: "heist",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "crime-mob",
      title: "Mob & Gangster",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.CRIME],
        keywordQuery: "gangster",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "crime-thrillers",
      title: "Crime Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.CRIME, MOVIE_GENRES.THRILLER],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "crime-top-rated",
      title: "Top Rated Crime",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.CRIME], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 800,
    },
    {
      id: "crime-neo-noir",
      title: "Neo-Noir",
      mediaType: "movie",
      filter: {
        includeGenreIds: [
          MOVIE_GENRES.CRIME,
          MOVIE_GENRES.MYSTERY,
          MOVIE_GENRES.THRILLER,
        ],
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
  ],

  // ── Documentary Movies ───────────────────────────────────────────────────
  "movie:99": [
    {
      id: "doc-trending",
      title: "Trending Documentaries",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.DOCUMENTARY] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "doc-top-rated",
      title: "Must-Watch Docs",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.DOCUMENTARY] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
    {
      id: "doc-nature",
      title: "Nature & Environment",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DOCUMENTARY],
        keywordQuery: "nature",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "doc-crime",
      title: "True Crime Docs",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DOCUMENTARY],
        keywordQuery: "true crime",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── Drama Movies ─────────────────────────────────────────────────────────
  "movie:18": [
    {
      id: "drama-trending",
      title: "Trending Drama",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "drama-awards",
      title: "Award Winners",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        minRating: 7.5,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "drama-crime",
      title: "Crime Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA, MOVIE_GENRES.CRIME],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "drama-romance",
      title: "Romantic Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA, MOVIE_GENRES.ROMANCE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "drama-war",
      title: "War Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA, MOVIE_GENRES.WAR],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "drama-classics",
      title: "Drama Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.DRAMA],
        yearLte: 1995,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 1000,
    },
  ],

  // ── Fantasy Movies ───────────────────────────────────────────────────────
  "movie:14": [
    {
      id: "fantasy-trending",
      title: "Trending Fantasy",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.FANTASY], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "fantasy-top-rated",
      title: "Epic Fantasy Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.FANTASY],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "fantasy-adventure",
      title: "Fantasy Adventure",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.FANTASY, MOVIE_GENRES.ADVENTURE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "fantasy-dark",
      title: "Dark Fantasy",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.FANTASY, MOVIE_GENRES.HORROR],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── Horror Movies ────────────────────────────────────────────────────────
  "movie:27": [
    {
      id: "horror-trending",
      title: "Trending Horror",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.HORROR] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "horror-top-rated",
      title: "Top Rated Horror",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.HORROR] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "horror-psychological",
      title: "Psychological Horror",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.HORROR, MOVIE_GENRES.MYSTERY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "horror-slasher",
      title: "Slashers & Survival",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.HORROR],
        keywordQuery: "slasher",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "horror-supernatural",
      title: "Supernatural Horror",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.HORROR],
        keywordQuery: "supernatural",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "horror-classics",
      title: "Horror Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.HORROR],
        yearLte: 2000,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
  ],

  // ── Mystery Movies ───────────────────────────────────────────────────────
  "movie:9648": [
    {
      id: "mystery-trending",
      title: "Trending Mysteries",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.MYSTERY], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "mystery-top-rated",
      title: "Best Whodunits",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.MYSTERY], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "mystery-thriller",
      title: "Mystery Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.MYSTERY, MOVIE_GENRES.THRILLER],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
  ],

  // ── Romance Movies ───────────────────────────────────────────────────────
  "movie:10749": [
    {
      id: "romance-trending",
      title: "Trending Romance",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ROMANCE], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "romance-top-rated",
      title: "Timeless Love Stories",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.ROMANCE], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "romance-drama",
      title: "Romantic Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ROMANCE, MOVIE_GENRES.DRAMA],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "romance-comedy",
      title: "Romantic Comedies",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.ROMANCE, MOVIE_GENRES.COMEDY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
  ],

  // ── Sci-Fi Movies ────────────────────────────────────────────────────────
  "movie:878": [
    {
      id: "scifi-trending",
      title: "Trending Sci-Fi",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION],
        excludeGenreIds: [MOVIE_GENRES.ANIMATION],
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "scifi-space",
      title: "Space Epics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION],
        keywordQuery: "space",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "scifi-dystopia",
      title: "Dystopian Future",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION],
        keywordQuery: "dystopia",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "scifi-aliens",
      title: "Alien Encounters",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION],
        keywordQuery: "alien",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "scifi-mind-bending",
      title: "Mind-Bending Sci-Fi",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION, MOVIE_GENRES.MYSTERY],
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "scifi-classics",
      title: "Classic Sci-Fi",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION],
        yearLte: 1995,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
  ],

  // ── Thriller Movies ──────────────────────────────────────────────────────
  "movie:53": [
    {
      id: "thriller-trending",
      title: "Trending Thrillers",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.THRILLER], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "thriller-top-rated",
      title: "Top Rated Thrillers",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.THRILLER], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 800,
    },
    {
      id: "thriller-psychological",
      title: "Psychological Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.THRILLER, MOVIE_GENRES.MYSTERY],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "thriller-action",
      title: "Action Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.THRILLER, MOVIE_GENRES.ACTION],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "thriller-spy",
      title: "Spy Thrillers",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.THRILLER],
        keywordQuery: "spy",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── War Movies ───────────────────────────────────────────────────────────
  "movie:10752": [
    {
      id: "war-trending",
      title: "Trending War Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.WAR], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "war-top-rated",
      title: "Greatest War Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.WAR], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "war-drama",
      title: "War Dramas",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.WAR, MOVIE_GENRES.DRAMA],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "war-classics",
      title: "War Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.WAR],
        yearLte: 1980,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
  ],

  // ── Western Movies ───────────────────────────────────────────────────────
  "movie:37": [
    {
      id: "western-trending",
      title: "Trending Westerns",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.WESTERN], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "western-top-rated",
      title: "Greatest Westerns",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.WESTERN], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "western-classics",
      title: "Spaghetti Western Classics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.WESTERN],
        yearLte: 1980,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
    {
      id: "western-modern",
      title: "Modern Westerns (Post-2000)",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.WESTERN],
        yearGte: 2000,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── Family Movies ────────────────────────────────────────────────────────
  "movie:10751": [
    {
      id: "family-trending",
      title: "Trending Family Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.FAMILY], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "family-animated",
      title: "Animated Family Films",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.FAMILY, MOVIE_GENRES.ANIMATION],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "family-adventure",
      title: "Family Adventure",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.FAMILY, MOVIE_GENRES.ADVENTURE],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "family-top-rated",
      title: "All-Time Family Favorites",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.FAMILY], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
  ],

  // ── History Movies ───────────────────────────────────────────────────────
  "movie:36": [
    {
      id: "history-trending",
      title: "Trending Historical Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.HISTORY], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "history-top-rated",
      title: "Best Historical Films",
      mediaType: "movie",
      filter: { includeGenreIds: [MOVIE_GENRES.HISTORY], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "history-war",
      title: "Historical War Epics",
      mediaType: "movie",
      filter: {
        includeGenreIds: [MOVIE_GENRES.HISTORY, MOVIE_GENRES.WAR],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Drama ────────────────────────────────────────────────────────────
  "tv:18": [
    {
      id: "tv-drama-trending",
      title: "Trending Dramas",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-drama-prestige",
      title: "Prestige Dramas",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        minRating: 8.0,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "tv-drama-crime",
      title: "Crime Dramas",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA, TV_GENRES.CRIME],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-drama-medical",
      title: "Medical Dramas",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA],
        keywordQuery: "medical",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-drama-political",
      title: "Political Dramas",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DRAMA, TV_GENRES.WAR_POLITICS],
        allowMixed: true,
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Crime ────────────────────────────────────────────────────────────
  "tv:80": [
    {
      id: "tv-crime-trending",
      title: "Trending Crime",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.CRIME],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-crime-top-rated",
      title: "Best Crime Shows",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.CRIME],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "tv-crime-procedural",
      title: "Crime Procedurals",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.CRIME, TV_GENRES.MYSTERY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-crime-thriller",
      title: "Crime Thrillers",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.CRIME, TV_GENRES.DRAMA],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
  ],

  // ── TV: Comedy ───────────────────────────────────────────────────────────
  "tv:35": [
    {
      id: "tv-comedy-trending",
      title: "Trending Comedies",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.COMEDY],
        excludeGenreIds: [TV_GENRES.TALK, TV_GENRES.REALITY],
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-comedy-top-rated",
      title: "All-Time Great Comedies",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.COMEDY],
        excludeGenreIds: [TV_GENRES.TALK, TV_GENRES.REALITY],
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 500,
    },
    {
      id: "tv-comedy-sitcoms",
      title: "Sitcoms & Office Humor",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.COMEDY],
        keywordQuery: "sitcom",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-comedy-dark",
      title: "Dark Comedies",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.COMEDY, TV_GENRES.DRAMA],
        allowMixed: true,
        excludeGenreIds: [TV_GENRES.TALK, TV_GENRES.REALITY],
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Sci-Fi & Fantasy ─────────────────────────────────────────────────
  "tv:10765": [
    {
      id: "tv-scifi-trending",
      title: "Trending Sci-Fi & Fantasy",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-scifi-top-rated",
      title: "Best Sci-Fi Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "tv-scifi-space",
      title: "Space Opera",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        keywordQuery: "space",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-scifi-dystopia",
      title: "Dystopian Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        keywordQuery: "dystopia",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-fantasy-epic",
      title: "Epic Fantasy Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
        keywordQuery: "fantasy",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Action & Adventure ───────────────────────────────────────────────
  "tv:10759": [
    {
      id: "tv-action-trending",
      title: "Trending Action Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ACTION_ADVENTURE],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-action-top-rated",
      title: "Best Action Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ACTION_ADVENTURE],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "tv-action-superhero",
      title: "Superhero Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ACTION_ADVENTURE],
        keywordQuery: "superhero",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "trending"],
    },
    {
      id: "tv-action-spy",
      title: "Spy & Espionage",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.ACTION_ADVENTURE],
        keywordQuery: "spy",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Mystery ──────────────────────────────────────────────────────────
  "tv:9648": [
    {
      id: "tv-mystery-trending",
      title: "Trending Mysteries",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.MYSTERY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-mystery-top-rated",
      title: "Best Mystery Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.MYSTERY],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 300,
    },
    {
      id: "tv-mystery-true-crime",
      title: "True Crime Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.MYSTERY, TV_GENRES.DOCUMENTARY],
        keywordQuery: "true crime",
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-mystery-detective",
      title: "Detective Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.MYSTERY, TV_GENRES.CRIME],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Documentary ──────────────────────────────────────────────────────
  "tv:99": [
    {
      id: "tv-doc-trending",
      title: "Trending Docuseries",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.DOCUMENTARY] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-doc-top-rated",
      title: "Must-Watch Docuseries",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.DOCUMENTARY] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 100,
    },
    {
      id: "tv-doc-nature",
      title: "Nature & Planet Earth",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DOCUMENTARY],
        keywordQuery: "nature",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
    {
      id: "tv-doc-crime",
      title: "True Crime Docuseries",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.DOCUMENTARY],
        keywordQuery: "true crime",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: War & Politics ───────────────────────────────────────────────────
  "tv:10768": [
    {
      id: "tv-war-trending",
      title: "Trending War & Politics",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.WAR_POLITICS],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-war-top-rated",
      title: "Best War & Political Series",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.WAR_POLITICS],
        excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        allowMixed: true,
      },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
  ],

  // ── TV: Family ───────────────────────────────────────────────────────────
  "tv:10751": [
    {
      id: "tv-family-trending",
      title: "Trending Family Shows",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.FAMILY], allowMixed: true },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-family-top-rated",
      title: "Best Family Series",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.FAMILY], allowMixed: true },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 200,
    },
    {
      id: "tv-family-kids",
      title: "For the Kids",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.FAMILY, TV_GENRES.KIDS],
        allowMixed: true,
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],

  // ── TV: Reality ──────────────────────────────────────────────────────────
  "tv:10764": [
    {
      id: "tv-reality-trending",
      title: "Trending Reality TV",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.REALITY] },
      mode: "trending",
      modes: ["trending"],
    },
    {
      id: "tv-reality-top-rated",
      title: "Most Loved Reality Shows",
      mediaType: "tv",
      filter: { includeGenreIds: [TV_GENRES.REALITY] },
      mode: "top_rated",
      modes: ["top_rated"],
      minVotes: 100,
    },
    {
      id: "tv-reality-competition",
      title: "Competition Shows",
      mediaType: "tv",
      filter: {
        includeGenreIds: [TV_GENRES.REALITY],
        keywordQuery: "competition",
      },
      mode: "mix",
      modes: ["popular", "top_rated"],
    },
  ],
};
