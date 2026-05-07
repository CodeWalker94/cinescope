import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGenreResults } from "../../hooks/useGenreResults.js";
import TitleCard from "../Browse Categories/TitleCard.jsx";
import SkeletonCard from "../Browse Categories/SkeletonCard.jsx";
import {
  MOVIE_GENRE_TILES,
  TV_GENRE_TILES,
  ANIMATION_GENRE_TILES,
} from "./GenreDashboard.jsx";

// Build a flat label lookup: "movie:28" → "Action", etc.
const LABEL_MAP = new Map();
[...MOVIE_GENRE_TILES, ...TV_GENRE_TILES].forEach((t) => {
  LABEL_MAP.set(`movie:${t.id}`, t.label);
  LABEL_MAP.set(`tv:${t.id}`, t.label);
});
ANIMATION_GENRE_TILES.forEach((t) => {
  LABEL_MAP.set(`${t.mediaType ?? "movie"}:${t.id}-${t.label}`, t.label);
  // also store by plain key as fallback
  if (!LABEL_MAP.has(`${t.mediaType}:${t.id}`)) {
    LABEL_MAP.set(`${t.mediaType}:${t.id}`, t.label);
  }
});

const getGenreLabel = (genreId, mediaType, label) =>
  label ??
  LABEL_MAP.get(`${mediaType}:${genreId}`) ??
  LABEL_MAP.get(`movie:${genreId}`) ??
  "Browse";

const SKELETON_COUNT = 12;

const GenreResultsGrid = ({ genreId, mediaType, onOpenDetails }) => {
  const navigate = useNavigate();
  const { items, isLoading, hasMore, hasError, loadMore } = useGenreResults({
    genreId,
    mediaType,
  });

  const [openMenuItemId, setOpenMenuItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const sentinelRef = useRef(null);

  const genreLabel = getGenreLabel(genreId, mediaType);
  const typeLabel = mediaType === "tv" ? "TV Shows" : "Movies";

  // IntersectionObserver — fires loadMore when the sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-16">
      {/* Back + heading row */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="
            flex items-center gap-1.5
            text-white/50 hover:text-white
            text-sm font-medium
            transition-colors duration-150
          "
        >
          <span className="text-xl leading-none">‹</span>
          All Genres
        </button>

        <div className="h-5 w-px bg-white/15" />

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-none">
            {genreLabel}
          </h1>
          <p className="text-white/40 text-xs mt-0.5">{typeLabel}</p>
        </div>
      </div>

      {hasError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200 mb-6">
          Something went wrong fetching these titles. Try again.
        </div>
      )}

      {/* Card grid — flex-wrap lets TitleCard's own widths set column count */}
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <TitleCard
            key={item.id}
            item={item}
            mediaType={mediaType}
            onOpenDetails={onOpenDetails}
            isMenuOpen={openMenuItemId === item.id}
            isActive={activeItemId === item.id}
            onActivate={() => setActiveItemId(item.id)}
            onToggleMenu={() =>
              setOpenMenuItemId((prev) => {
                const next = prev === item.id ? null : item.id;
                setActiveItemId(item.id);
                return next;
              })
            }
            onCloseMenu={() => setOpenMenuItemId(null)}
          />
        ))}

        {/* Skeleton fill while loading */}
        {isLoading &&
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
      </div>

      {/* Sentinel div — IntersectionObserver triggers loadMore here */}
      {hasMore && !hasError && (
        <div ref={sentinelRef} className="h-12 w-full" aria-hidden />
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-white/30 text-sm mt-10">
          You've seen everything in {genreLabel}.
        </p>
      )}
    </div>
  );
};

export default GenreResultsGrid;
