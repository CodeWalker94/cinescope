// Pure helper functions shared across the app.

/** Returns the display title for any TMDB item (movie or TV). */
export const getTitle = (item) =>
  item?.title ||
  item?.name ||
  item?.original_title ||
  item?.original_name ||
  "Untitled";

/** Returns the 4-digit release year string, or empty string if unknown. */
export const getYear = (item) => {
  const date = item?.release_date || item?.first_air_date || "";
  return date ? String(date).slice(0, 4) : "";
};

/** Formats a runtime in minutes to a "2h 15m" style string. */
export const formatRuntime = (minutes) => {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0)
    return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
};

/** Formats a TMDB vote_average to one decimal place. */
export const formatScore = (voteAverage) => {
  if (typeof voteAverage !== "number") return "";
  return voteAverage.toFixed(1);
};

/**
 * Infers media type from item data when an explicit type isn't provided.
 * TMDB trending results include media_type; discover results don't.
 */
export const inferMediaType = (item, explicitType) =>
  explicitType || item?.media_type || (item?.first_air_date ? "tv" : "movie");

/** Fisher-Yates shuffle — returns a new array, never mutates the original. */
export const shuffle = (list) => {
  const arr = [...list];
  arr.forEach((_, currentIndex) => {
    const swapIndex = Math.floor(Math.random() * (currentIndex + 1));
    [arr[currentIndex], arr[swapIndex]] = [arr[swapIndex], arr[currentIndex]];
  });
  return arr;
};
