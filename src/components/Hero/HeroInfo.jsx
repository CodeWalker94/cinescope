import {
  getTitle,
  getYear,
  formatRuntime,
  formatScore,
  inferMediaType,
} from "../../utils/titleHelpers";

const HeroInfo = ({ movie, onOpenDetails }) => {
  if (!movie) return null;

  const title = getTitle(movie);
  const year = getYear(movie);
  const rating = formatScore(movie.vote_average);
  const isTv = inferMediaType(movie) === "tv";
  const mediaTypeLabel = isTv ? "Series" : "Movie";

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
            className="hero-btn hero-btn-tertiary"
            aria-label="Add to My List"
          >
            <span className="hero-btn-icon">＋</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroInfo;
