import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GENRE_ROWS } from "../../API/tmdbGenres.js";
import { discoverTitles } from "../../API/tmdb.js";
import {
  MOVIE_GENRE_TILES,
  TV_GENRE_TILES,
  ANIMATION_GENRE_TILES,
} from "./GenreDashboard.jsx";
import GenreRowSection from "./GenreRowSection.jsx";

// Build label + bg + emoji lookup from all tile configs
const META_MAP = new Map();
[...MOVIE_GENRE_TILES, ...TV_GENRE_TILES, ...ANIMATION_GENRE_TILES].forEach(
  (t) => {
    const movieKey = `movie:${t.id}`;
    const tvKey = `tv:${t.id}`;
    if (!META_MAP.has(movieKey))
      META_MAP.set(movieKey, { label: t.label, bg: t.bg, emoji: t.emoji });
    if (!META_MAP.has(tvKey))
      META_MAP.set(tvKey, { label: t.label, bg: t.bg, emoji: t.emoji });
  },
);

const getMeta = (genreId, mediaType) =>
  META_MAP.get(`${mediaType}:${genreId}`) ??
  META_MAP.get(`movie:${genreId}`) ?? {
    label: "Browse",
    bg: "linear-gradient(135deg,#2a39ff,#6d28d9)",
    emoji: "🎬",
  };

const GenrePage = ({ genreId, mediaType, isAnime = false, onOpenDetails }) => {
  const navigate = useNavigate();

  // Anime tile routes to genre=16&type=tv&anime=1 — use a dedicated row key
  const rowKey = isAnime ? "tv:16:anime" : `${mediaType}:${genreId}`;
  const rows = GENRE_ROWS[rowKey] ?? [];

  const { label: rawLabel, bg: heroBg } = getMeta(genreId, mediaType);
  const genreLabel = isAnime ? "Anime" : rawLabel;
  const typeLabel = isAnime
    ? "TV / Film"
    : mediaType === "tv"
      ? "TV Shows"
      : "Movies";

  const [heroBackdrops, setHeroBackdrops] = useState([]);

  useEffect(() => {
    let cancelled = false;
    discoverTitles({
      mediaType: isAnime ? "tv" : mediaType,
      page: 1,
      sortBy: "popularity.desc",
      includeGenreIds: [Number(genreId)],
      ...(isAnime ? { originalLanguage: "ja" } : {}),
    }).then((results) => {
      if (cancelled) return;
      const paths = results
        .filter((r) => r.backdrop_path)
        .slice(0, 3)
        .map((r) => `https://image.tmdb.org/t/p/w780${r.backdrop_path}`);
      setHeroBackdrops(paths);
    });
    return () => {
      cancelled = true;
    };
  }, [genreId, mediaType, isAnime]);

  return (
    <div className="pb-16">
      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <div className="relative w-full h-56 sm:h-72 overflow-hidden mb-2">
        {/* Backdrop collage — 3 images side by side, zoomed/cropped */}
        <div className="absolute inset-0 flex">
          {heroBackdrops.length > 0 ? (
            heroBackdrops.map((url, i) => (
              <div
                key={i}
                className="flex-1 bg-center bg-cover"
                style={{ backgroundImage: `url(${url})` }}
              />
            ))
          ) : (
            /* Fallback: solid gradient until images load */
            <div className="flex-1" style={{ background: heroBg }} />
          )}
        </div>

        {/* Genre color overlay — pulls from tile's gradient */}
        <div
          className="absolute inset-0 opacity-75"
          style={{ background: heroBg }}
        />

        {/* Top fade — makes the sticky header bar appear transparent */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cine-bg via-cine-bg/60 to-transparent" />

        {/* Bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-cine-bg" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors duration-150 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          <span className="text-lg leading-none">‹</span>
          All Genres
        </button>

        {/* Genre name — centered, giant */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-1 px-4 text-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-2xl uppercase">
            {genreLabel}
          </h1>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">
            {typeLabel}
          </p>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((rowConfig) => (
            <GenreRowSection
              key={rowConfig.id}
              rowConfig={rowConfig}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        // Fallback: genre not in GENRE_ROWS yet — show a single trending row
        <GenreRowSection
          rowConfig={{
            id: `fallback-${rowKey}`,
            title: `Trending ${genreLabel}`,
            mediaType,
            filter: { includeGenreIds: [Number(genreId)], allowMixed: true },
            mode: "mix",
            modes: ["popular", "trending"],
          }}
          onOpenDetails={onOpenDetails}
        />
      )}
    </div>
  );
};

export default GenrePage;
