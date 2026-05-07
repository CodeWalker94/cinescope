import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DASHBOARD_ROWS } from "../../API/tmdbGenres.js";
import DashboardHero from "./DashboardHero.jsx";
import GenreRowSection from "./GenreRowSection.jsx";

// ─── Genre tile configs ─────────────────────────────────────────────────────
// Inline gradient styles — Tailwind can't scan these dynamic hex values, so
// we use style props here instead of utility classes.

export const MOVIE_GENRE_TILES = [
  {
    id: 28,
    label: "Action",
    emoji: "💥",
    bg: "linear-gradient(135deg,#7f1d1d,#c2410c)",
  },
  {
    id: 12,
    label: "Adventure",
    emoji: "🗺️",
    bg: "linear-gradient(135deg,#92400e,#166534)",
  },
  {
    id: 35,
    label: "Comedy",
    emoji: "😂",
    bg: "linear-gradient(135deg,#a16207,#4d7c0f)",
  },
  {
    id: 80,
    label: "Crime",
    emoji: "🔍",
    bg: "linear-gradient(135deg,#374151,#111827)",
  },
  {
    id: 99,
    label: "Documentary",
    emoji: "🎥",
    bg: "linear-gradient(135deg,#0c4a6e,#1d4ed8)",
  },
  {
    id: 18,
    label: "Drama",
    emoji: "🎭",
    bg: "linear-gradient(135deg,#4c1d95,#1e1b4b)",
  },
  {
    id: 10751,
    label: "Family",
    emoji: "👨‍👩‍👧",
    bg: "linear-gradient(135deg,#15803d,#0f766e)",
  },
  {
    id: 14,
    label: "Fantasy",
    emoji: "🧙",
    bg: "linear-gradient(135deg,#6d28d9,#4338ca)",
  },
  {
    id: 27,
    label: "Horror",
    emoji: "👻",
    bg: "linear-gradient(135deg,#7f1d1d,#0f172a)",
  },
  {
    id: 9648,
    label: "Mystery",
    emoji: "🕵️",
    bg: "linear-gradient(135deg,#1e293b,#0f172a)",
  },
  {
    id: 10749,
    label: "Romance",
    emoji: "💕",
    bg: "linear-gradient(135deg,#9f1239,#be185d)",
  },
  {
    id: 878,
    label: "Sci-Fi",
    emoji: "🚀",
    bg: "linear-gradient(135deg,#0e7490,#1e3a5f)",
  },
  {
    id: 53,
    label: "Thriller",
    emoji: "⚡",
    bg: "linear-gradient(135deg,#292524,#0f172a)",
  },
  {
    id: 10752,
    label: "War",
    emoji: "🎖️",
    bg: "linear-gradient(135deg,#14532d,#1c1917)",
  },
  {
    id: 37,
    label: "Western",
    emoji: "🤠",
    bg: "linear-gradient(135deg,#78350f,#1c1917)",
  },
];

export const TV_GENRE_TILES = [
  {
    id: 10759,
    label: "Action & Adventure",
    emoji: "⚔️",
    bg: "linear-gradient(135deg,#7f1d1d,#c2410c)",
  },
  {
    id: 35,
    label: "Comedy",
    emoji: "😂",
    bg: "linear-gradient(135deg,#a16207,#4d7c0f)",
  },
  {
    id: 80,
    label: "Crime",
    emoji: "🔍",
    bg: "linear-gradient(135deg,#374151,#111827)",
  },
  {
    id: 99,
    label: "Documentary",
    emoji: "🎥",
    bg: "linear-gradient(135deg,#0c4a6e,#1d4ed8)",
  },
  {
    id: 18,
    label: "Drama",
    emoji: "🎭",
    bg: "linear-gradient(135deg,#4c1d95,#1e1b4b)",
  },
  {
    id: 10751,
    label: "Family",
    emoji: "👨‍👩‍👧",
    bg: "linear-gradient(135deg,#15803d,#0f766e)",
  },
  {
    id: 10762,
    label: "Kids",
    emoji: "🎠",
    bg: "linear-gradient(135deg,#86198f,#6d28d9)",
  },
  {
    id: 9648,
    label: "Mystery",
    emoji: "🕵️",
    bg: "linear-gradient(135deg,#1e293b,#0f172a)",
  },
  {
    id: 10764,
    label: "Reality",
    emoji: "📺",
    bg: "linear-gradient(135deg,#c2410c,#be185d)",
  },
  {
    id: 10765,
    label: "Sci-Fi & Fantasy",
    emoji: "🚀",
    bg: "linear-gradient(135deg,#0e7490,#1e3a5f)",
  },
  {
    id: 10768,
    label: "War & Politics",
    emoji: "🎖️",
    bg: "linear-gradient(135deg,#14532d,#1c1917)",
  },
];

export const ANIMATION_GENRE_TILES = [
  {
    id: 16,
    label: "Animated Movies",
    mediaType: "movie",
    emoji: "🎬",
    bg: "linear-gradient(135deg,#2a39ff,#6d28d9)",
  },
  {
    id: 16,
    label: "Animated Series",
    mediaType: "tv",
    emoji: "📺",
    bg: "linear-gradient(135deg,#6d28d9,#1e1b4b)",
  },
  {
    id: 16,
    label: "Anime",
    mediaType: "tv",
    emoji: "⛩️",
    bg: "linear-gradient(135deg,#be185d,#6d28d9)",
    isAnime: true,
  },
];

const TABS = [
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "animation", label: "Animation" },
];

const TILES_BY_TAB = {
  movie: MOVIE_GENRE_TILES,
  tv: TV_GENRE_TILES,
  animation: ANIMATION_GENRE_TILES,
};

// ─── Component ───────────────────────────────────────────────────────────────

const GenreDashboard = ({ onOpenDetails }) => {
  const [searchParams] = useSearchParams();
  const initialTab = ["movie", "tv", "animation"].includes(
    searchParams.get("tab"),
  )
    ? searchParams.get("tab")
    : "movie";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // Sync tab when the URL changes (e.g. clicking a header nav link while already on /search)
  // When tabParam is null (Browse link, no ?tab=), reset to default "movie"
  const tabParam = searchParams.get("tab");
  useEffect(() => {
    const valid = ["movie", "tv", "animation"];
    setActiveTab(valid.includes(tabParam) ? tabParam : "movie");
  }, [tabParam]);

  const tiles = TILES_BY_TAB[activeTab];
  const dashboardRows = DASHBOARD_ROWS[activeTab] ?? [];

  const handleTile = (tile) => {
    const type = tile.mediaType ?? activeTab;
    const extra = tile.isAnime ? "&anime=1" : "";
    navigate(`/search?genre=${tile.id}&type=${type}${extra}`);
  };

  return (
    <div className="pb-16">
      {/* Hero banner — bleeds under sticky header via negative margin */}
      <DashboardHero />

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl bg-white/5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
              px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-cine-accent text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }
            `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Genre tile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {tiles.map((tile) => (
            <button
              key={`${tile.id}-${tile.label}`}
              type="button"
              onClick={() => handleTile(tile)}
              style={{ background: tile.bg }}
              className="
              aspect-video rounded-2xl
              flex flex-col items-center justify-center gap-2
              border border-white/10
              hover:scale-[1.03] hover:brightness-110
              active:scale-[0.98]
              transition-all duration-200
              cursor-pointer
              group
            "
            >
              <span className="text-3xl sm:text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                {tile.emoji}
              </span>
              <span className="text-white font-bold text-sm sm:text-base text-center leading-tight px-2 drop-shadow">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* end max-w container */}

      {/* Curated strips — reuse SearchRow's own max-w padding */}
      <div className="mt-2 space-y-2">
        {dashboardRows.map((rowConfig) => (
          <GenreRowSection
            key={rowConfig.id}
            rowConfig={rowConfig}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default GenreDashboard;
