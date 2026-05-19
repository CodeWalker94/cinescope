import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getTitle,
  getYear,
  formatRuntime,
  formatScore,
  inferMediaType,
} from "../../utils/titleHelpers";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "../../utils/watchlistStorage";

const HeroInfo = ({ movie, onOpenDetails }) => {
  const mediaType = inferMediaType(movie);
  const movieId = movie?.id;

  const [inWatchlist, setInWatchlist] = useState(() =>
    movieId ? isInWatchlist(movieId, mediaType) : false,
  );

  // Sync when movie changes or storage updates from elsewhere
  useEffect(() => {
    if (!movieId) return;
    const sync = () => setInWatchlist(isInWatchlist(movieId, mediaType));
    sync();
    window.addEventListener("watchlist-change", sync);
    return () => window.removeEventListener("watchlist-change", sync);
  }, [movieId, mediaType]);

  if (!movie) return null;

  const title = getTitle(movie);
  const year = getYear(movie);
  const rating = formatScore(movie.vote_average);
  const isTv = mediaType === "tv";
  const mediaTypeLabel = isTv ? "Series" : "Movie";

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movieId, mediaType);
      toast(`Removed "${title}" from your Watchlist`);
    } else {
      addToWatchlist({ id: movieId, mediaType, title, poster_path: movie.poster_path });
      toast.success(`Added "${title}" to your Watchlist`);
    }
  };

  // =============================
  // NEW → CERTIFICATION LOGIC
  // =============================
  let certification = null;

  if (isTv && movie.content_ratings?.results) {
    const us = movie.content_ratings.results.find((r) => r.iso_3166_1 === "US");
    certification = us?.rating || null;
  }

  if (!isTv && movie.release_dates?.results) {
    const us = movie.release_dates.results.find((r) => r.iso_3166_1 === "US");

    if (us?.release_dates?.length) {
      const withCert = us.release_dates.find(
        (d) => d.certification && d.certification.trim() !== "",
      );
      certification = withCert?.certification || null;
    }
  }
  // =============================

  const runtimeMinutes = isTv ? movie.episode_run_time?.[0] : movie.runtime;
  const runtimeLabel = formatRuntime(runtimeMinutes) || null;

  const genres =
    Array.isArray(movie.genres) && movie.genres.length
      ? movie.genres
          .slice(0, 3)
          .map((g) => g.name)
          .join(" • ")
      : null;

  const overview =
    movie.overview || "No synopsis available for this title yet.";

  const handleMore = () =>
    onOpenDetails?.({ item: movie, mediaType: inferMediaType(movie) });

  return (
    <div className="hero-content max-w-5xl px-5 sm:px-10 pb-16">
      {/* Title */}
      <h1 className="hero-title">{title}</h1>

      {/* Content Wrapper */}
      <div>
        {/* Meta pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="hero-pill">{mediaTypeLabel}</span>
          {year && <span className="hero-pill">{year}</span>}

          {rating && (
            <span className="hero-pill">
              ★ {rating}
              <span className="opacity-70"> / 10</span>
            </span>
          )}

          {runtimeLabel && <span className="hero-pill">{runtimeLabel}</span>}

          {certification && <span className="hero-pill">{certification}</span>}
        </div>

        {/* Genres */}
        {genres && (
          <p className="mt-2 text-xs sm:text-sm text-cine-muted">{genres}</p>
        )}

        {/* Overview */}
        <p className="hero-subtitle hero-overview mt-4 max-w-2xl">{overview}</p>

        <button
          type="button"
          onClick={handleMore}
          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-cine-highlight hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60 rounded"
          aria-label="More details"
        >
          More
          <span aria-hidden="true">›</span>
        </button>

        {/* Actions */}
        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary">
            <span className="hero-btn-icon">▶</span>
            <span>Play Now</span>
          </button>

          <button className="hero-btn hero-btn-secondary">
            <span className="hero-btn-icon">▸</span>
            <span>Watch Trailer</span>
          </button>

          <button
            type="button"
            onClick={handleWatchlistToggle}
            className={`hero-btn hero-btn-tertiary ${inWatchlist ? "bg-white/15 border-cine-highlight text-cine-highlight" : ""}`}
            aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-pressed={inWatchlist}
          >
            <span className="hero-btn-icon">{inWatchlist ? "−" : "＋"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroInfo;
