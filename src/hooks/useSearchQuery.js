import { useSearchParams } from "react-router-dom";

export const useSearchQuery = () => {
  const [params, setParams] = useSearchParams();
  // Read
  const query = params.get("q") ?? "";
  const genreId = params.get("genre") ?? "";
  const mediaType = params.get("type") ?? "movie";
  const isAnime = params.get("anime") === "1";

  const setQuery = (term) => setParams({ q: term });

  const setGenreFilter = (id, type = "movie") => setParams({ genre: id, type });

  return { query, genreId, mediaType, isAnime, setQuery, setGenreFilter };
};
