import { useEffect, useState } from "react";
import { getTitleCredits, getTitleDetails } from "../API/tmdb";
import {
  getTitle,
  getYear,
  formatRuntime,
  formatScore,
} from "../utils/titleHelpers";

// TMDB returns path fragments (e.g. "/abc123.jpg") — prefix with base URL + size bucket.
const TMDB_IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_W342 = "https://image.tmdb.org/t/p/w342";

const RATINGS_STORAGE_KEY = "cinescope:ratings";

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Both mediaType and id are needed — TMDB reuses numeric IDs across movies and TV shows.
const getRatingKey = (mediaType, id) => `${mediaType}:${id}`;

const readStoredRating = (mediaType, id) => {
  const raw = localStorage.getItem(RATINGS_STORAGE_KEY);
  const map = safeJsonParse(raw, {});
  const value = map?.[getRatingKey(mediaType, id)];
  if (value === "like" || value === "dislike") return value; // whitelist — reject unexpected stored values
  return "neutral";
};

const writeStoredRating = (mediaType, id, rating) => {
  const raw = localStorage.getItem(RATINGS_STORAGE_KEY);
  const map = safeJsonParse(raw, {});
  const key = getRatingKey(mediaType, id);
  const next = { ...map };
  if (rating === "neutral")
    delete next[key]; // no point storing a non-rating
  else next[key] = rating;
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(next));
};

/**
 * Fetches full details + credits for a modal selection.
 * Also manages the persisted like/dislike rating for the title.
 *
 * @param {{ isOpen: boolean, id: number|string, mediaType: string, selection: object }} params
 */
export function useModalData({ isOpen, id, mediaType, selection }) {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [rating, setRating] = useState("neutral"); // "like" | "dislike" | "neutral"

  // Restore saved rating when the modal opens
  useEffect(() => {
    if (!isOpen || !id) return;
    setRating(readStoredRating(mediaType, id));
  }, [isOpen, id, mediaType]);

  // Fetch details + credits in parallel; ignore the response if the modal closes first
  useEffect(() => {
    if (!isOpen || !id) return;

    // Prevent stale state updates if the modal closes before the request finishes
    let cancelled = false;

    // Reset so we don't flash the previous title's data while loading
    setIsLoading(true);
    setHasError(false);
    setDetails(null);
    setCredits(null);

    // useEffect can't be async — async IIFE is the standard workaround
    (async () => {
      try {
        // Fire both requests simultaneously rather than sequentially
        const [detailsResult, creditsResult] = await Promise.all([
          getTitleDetails(id, mediaType),
          getTitleCredits(id, mediaType),
        ]);
        if (cancelled) return;
        setDetails(detailsResult);
        setCredits(creditsResult);
      } catch (err) {
        console.error("Modal details fetch error", err);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, id, mediaType]);

  const setAndPersistRating = (next) => {
    setRating(next);
    writeStoredRating(mediaType, id, next);
  };

  // Clicking the active button a second time clears the rating back to neutral
  const handleThumbUp = () =>
    setAndPersistRating(rating === "like" ? "neutral" : "like");

  const handleThumbDown = () =>
    setAndPersistRating(rating === "dislike" ? "neutral" : "dislike");

  // Derived values — fall back to `selection` while details are still loading
  // so the modal shows something meaningful immediately on open.

  const titleText = getTitle(details || selection);
  const yearText = getYear(details || selection);

  const backdropPath = details?.backdrop_path || selection?.backdrop_path;
  const backdropUrl = backdropPath
    ? `${TMDB_IMG_ORIGINAL}${backdropPath}`
    : null;

  const posterPath = details?.poster_path || selection?.poster_path;
  const posterUrl = posterPath ? `${TMDB_IMG_W342}${posterPath}` : null;

  const genresText =
    details?.genres
      ?.slice(0, 4)
      .map((g) => g?.name)
      .filter(Boolean)
      .join(" • ") ?? "";

  const runtimeText = !details
    ? ""
    : mediaType === "tv"
      ? typeof details.number_of_seasons === "number"
        ? `${details.number_of_seasons} season${details.number_of_seasons === 1 ? "" : "s"}`
        : details.episode_run_time?.[0]
          ? `${formatRuntime(details.episode_run_time[0])} per ep`
          : ""
      : formatRuntime(details?.runtime);

  const scoreText = formatScore(
    details?.vote_average ?? selection?.vote_average,
  );
  const cast = Array.isArray(credits?.cast) ? credits.cast.slice(0, 10) : [];

  return {
    details,
    isLoading,
    hasError,
    rating,
    handleThumbUp,
    handleThumbDown,
    titleText,
    yearText,
    backdropUrl,
    posterUrl,
    genresText,
    runtimeText,
    scoreText,
    cast,
  };
}
