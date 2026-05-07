// src/API/tmdb.js
import axios from "axios";

/**
 * ============================================================
 * TMDB CLIENT
 * ============================================================
 * - Base URL: https://api.themoviedb.org/3
 * - API key is attached to every request via default params
 */
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 12000,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

/**
 * ============================================================
 * TRENDING
 * ============================================================
 * Use this when you truly mean "Trending right now".
 * mediaType: "movie" | "tv" | "all"
 * timeWindow: "day" | "week"
 *
 * ✅ UPDATE: supports pagination (page)
 */
export const getTrendingTitles = async (
  mediaType = "all",
  timeWindow = "week",
  page = 1,
) => {
  const res = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, {
    params: { page },
  });

  return res.data?.results ?? [];
};

export const searchTmdb = async (query, mediaType = "multi", page = 1) => {
  if (!query || !query.trim()) return [];

  const endpoint =
    mediaType === "tv"
      ? "/search/tv"
      : mediaType === "movie"
        ? "/search/movie"
        : "/search/multi";

  const res = await tmdbClient.get(endpoint, {
    params: {
      query,
      include_adult: false,
      page,
    },
  });

  return res.data?.results ?? [];
};

/**
 * ============================================================
 * DETAILS
 * ============================================================
 * Fetch full details for a title.
 * - movie: includes "release_dates" for ratings/regions
 * - tv: includes "content_ratings"
 *
 * Later: you can also append "videos" for trailers when you build modals.
 */
export const getTitleDetails = async (id, mediaType = "movie") => {
  const isTv = mediaType === "tv";

  const res = await tmdbClient.get(`/${isTv ? "tv" : "movie"}/${id}`, {
    params: {
      append_to_response: isTv ? "content_ratings" : "release_dates",
    },
  });

  return res.data;
};

/**
 * ============================================================
 * CREDITS (cast)
 * ============================================================
 * Used for the title details modal.
 */
export const getTitleCredits = async (id, mediaType = "movie") => {
  const isTv = mediaType === "tv";

  const res = await tmdbClient.get(`/${isTv ? "tv" : "movie"}/${id}/credits`);
  return res.data;
};

/**
 * ============================================================
 * IMAGE HELPERS (poster / backdrop)
 * ============================================================
 * Given a title string (ex: "The Office"), search TMDB and return
 * either poster_path or backdrop_path from the first match.
 */
export const getImagePathForTitle = async (
  title,
  mediaType = "movie",
  imageType = "poster", // "poster" | "backdrop"
) => {
  if (!title) return null;

  const searchEndpoint = mediaType === "tv" ? "/search/tv" : "/search/movie";

  const res = await tmdbClient.get(searchEndpoint, {
    params: {
      query: title,
      include_adult: false,
    },
  });

  const results = res.data?.results ?? [];
  if (results.length === 0) return null;

  const firstMatch = results[0];

  if (imageType === "poster") return firstMatch.poster_path ?? null;
  if (imageType === "backdrop") return firstMatch.backdrop_path ?? null;

  return null;
};

export const getPosterPathForTitle = (title, mediaType = "movie") => {
  return getImagePathForTitle(title, mediaType, "poster");
};

export const getBackdropPathForTitle = (title, mediaType = "movie") => {
  return getImagePathForTitle(title, mediaType, "backdrop");
};

/**
 * ============================================================
 * KEYWORDS (for Anime filtering, etc.)
 * ============================================================
 */
const keywordIdCache = new Map();

export const getKeywordId = async (keywordQuery) => {
  if (!keywordQuery) return null;

  const cacheKey = keywordQuery.toLowerCase().trim();
  if (keywordIdCache.has(cacheKey)) {
    return keywordIdCache.get(cacheKey);
  }

  const res = await tmdbClient.get("/search/keyword", {
    params: { query: keywordQuery },
  });

  // Pick the first match (good enough for now; we can improve later)
  const firstId = res.data?.results?.[0]?.id ?? null;

  keywordIdCache.set(cacheKey, firstId);
  return firstId;
};

/**
 * ============================================================
 * DISCOVER (Movies / TV)
 * ============================================================
 * This is your main "browse by genre" fetch.
 *
 * Supports:
 * - includeGenreIds: number[] (required for your BrowseRow)
 * - excludeGenreIds: number[] (required for your BrowseRow)
 * - sorting (popular, top rated, etc)
 * - minVotes (to avoid "top rated" junk with 4 votes)
 * - originalLanguage (ex: "ja" for anime)
 * - keywordQuery (ex: "anime" -> looks up keyword id -> with_keywords)
 * - yearGte / yearLte (ex: yearLte: 2000 for classics)
 */
export const discoverTitles = async ({
  mediaType = "movie",
  page = 1,
  sortBy = "popularity.desc",

  includeGenreIds,
  excludeGenreIds,

  // optional refiners
  minVotes,
  minRating,
  originalLanguage,
  keywordQuery,

  // date range (year)
  yearGte,
  yearLte,

  // movie-only refiners
  certificationCountry,
  certificationLte,
  // TV content rating (e.g. certificationGte: "TV-14" to exclude kids shows)
  certificationGte,
}) => {
  const endpoint = mediaType === "tv" ? "/discover/tv" : "/discover/movie";
  const isTv = mediaType === "tv";

  // Convert keywordQuery -> keywordId once
  const keywordId = keywordQuery ? await getKeywordId(keywordQuery) : null;

  const withGenres =
    Array.isArray(includeGenreIds) && includeGenreIds.length > 0
      ? includeGenreIds.join(",")
      : "";

  const withoutGenres =
    Array.isArray(excludeGenreIds) && excludeGenreIds.length > 0
      ? excludeGenreIds.join(",")
      : "";

  // Map year bounds to the right TMDB param name depending on media type
  const dateGteKey = isTv ? "first_air_date.gte" : "primary_release_date.gte";
  const dateLteKey = isTv ? "first_air_date.lte" : "primary_release_date.lte";

  const res = await tmdbClient.get(endpoint, {
    params: {
      page,
      sort_by: sortBy,

      // only include if we actually have something to filter by
      ...(withGenres ? { with_genres: withGenres } : {}),
      ...(withoutGenres ? { without_genres: withoutGenres } : {}),

      include_adult: false,
      include_video: false,

      ...(typeof minVotes === "number" ? { "vote_count.gte": minVotes } : {}),
      ...(typeof minRating === "number"
        ? { "vote_average.gte": minRating }
        : {}),
      ...(originalLanguage ? { with_original_language: originalLanguage } : {}),
      ...(keywordId ? { with_keywords: keywordId } : {}),

      // Date range
      ...(yearGte ? { [dateGteKey]: `${yearGte}-01-01` } : {}),
      ...(yearLte ? { [dateLteKey]: `${yearLte}-12-31` } : {}),

      // Movie certifications (MPAA-like). TV discover does not support these.
      ...(mediaType === "movie" && certificationCountry
        ? { certification_country: certificationCountry }
        : {}),
      ...(mediaType === "movie" && certificationLte
        ? { "certification.lte": certificationLte }
        : {}),
      // TV content ratings (US: TV-Y, TV-G, TV-PG, TV-14, TV-MA)
      ...(mediaType === "tv" && certificationGte
        ? { certification_country: "US", "certification.gte": certificationGte }
        : {}),
    },
  });

  return res.data?.results ?? [];
};
