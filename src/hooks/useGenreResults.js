import { useCallback, useEffect, useRef, useState } from "react";
import { discoverTitles } from "../API/tmdb";

/**
 * Paginated infinite-scroll hook for a single genre.
 * Resets automatically when genreId or mediaType changes.
 * De-dupes results so re-renders in StrictMode don't double-append.
 */
export const useGenreResults = ({ genreId, mediaType }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchedPages = useRef(new Set());

  // Stable ref so the IntersectionObserver callback always sees fresh values
  // without needing to be recreated when isLoading / hasMore change.
  const canLoadRef = useRef(true);
  canLoadRef.current = !isLoading && hasMore;

  // Reset when the genre or media type changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setHasError(false);
    fetchedPages.current = new Set();
  }, [genreId, mediaType]);

  useEffect(() => {
    if (!genreId || !mediaType) return;

    const key = `${genreId}-${mediaType}-${page}`;
    if (fetchedPages.current.has(key)) return;
    fetchedPages.current.add(key);

    let cancelled = false;
    setIsLoading(true);

    discoverTitles({
      mediaType,
      page,
      includeGenreIds: [Number(genreId)],
      minVotes: 20,
      sortBy: "popularity.desc",
    })
      .then((results) => {
        if (cancelled) return;
        // De-dupe by id in case TMDB overlaps pages
        setItems((prev) => {
          const merged = new Map(prev.map((i) => [i.id, i]));
          results.forEach((i) => merged.set(i.id, i));
          return [...merged.values()];
        });
        setHasMore(results.length >= 20);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [genreId, mediaType, page]);

  const loadMore = useCallback(() => {
    if (canLoadRef.current) setPage((p) => p + 1);
  }, []);

  return { items, isLoading, hasMore, hasError, loadMore };
};
