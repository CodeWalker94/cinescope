import { useEffect, useState } from "react";
import { searchTmdb } from "../API/tmdb";

const MIN_QUERY_LENGTH = 2;

export const useSearchResults = (query) => {
  const [multiResults, setMultiResults] = useState([]);
  const [movieResults, setMovieResults] = useState([]);
  const [tvResults, setTvResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < MIN_QUERY_LENGTH) {
      setMultiResults([]);
      setMovieResults([]);
      setTvResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isCancelled = false;
    const handleSearch = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [multi, movie, tv] = await Promise.all([
          searchTmdb(query, "multi"),
          searchTmdb(query, "movie"),
          searchTmdb(query, "tv"),
        ]);

        if (!isCancelled) {
          setMultiResults(multi);
          setMovieResults(movie);
          setTvResults(tv);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Search error", error);
          setHasError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(handleSearch, 400);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { multiResults, movieResults, tvResults, isLoading, hasError };
};
