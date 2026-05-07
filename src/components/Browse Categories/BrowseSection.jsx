// src/components/Browse Categories/BrowseSection.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackdropPathForTitle } from "../../API/tmdb";
import {
  MOVIE_GENRES,
  TV_GENRES,
  EXCLUDE_TV_NON_SERIES,
} from "../../API/tmdbGenres";
import BrowseRow from "./BrowseRow";

/**
 * Row filtering strategy (real-world TMDB approach):
 * - includeGenreIds: required "shelf" genres
 * - excludeGenreIds: remove obvious wrong-shelf genres
 * - keywordQuery / originalLanguage: optional refiners (anime, sitcom, etc.)
 *
 * IMPORTANT:
 * TMDB genres are not "primary genre" by default. Our BrowseRow enforces primary genre
 * match for shelves (when includeGenreIds exists), which prevents misplaced results.
 */
const BROWSE_TABS = {
  movies: {
    id: "movies",
    label: "Movies",
    tmdbTitle: "Mission: Impossible - Dead Reckoning Part One",
    mediaType: "movie",
    hero: {
      eyebrow: "Browse Movies",
      title: "Blockbuster hits, thrillers, sci-fi & more.",
      description:
        "Explore cinematic favorites, new releases, and award-winning films all in one place.",
      gradient: "from-[#0B0D17] via-[#141633] to-[#2A39FF]",
    },

    // ✅ 4 rows
    rows: [
      {
        id: "movies-essentials",
        title: "Must See Films",
        mediaType: "movie",
        filter: {
          includeGenreIds: [MOVIE_GENRES.ACTION, MOVIE_GENRES.ADVENTURE],
          allowMixed: true,
        },
        mode: "mix",
        modes: ["popular", "trending", "top_rated"],
        minVotes: 300,
      },
      {
        id: "movies-action",
        title: "Action & Adventure",
        mediaType: "movie",
        filter: {
          includeGenreIds: [MOVIE_GENRES.ACTION, MOVIE_GENRES.ADVENTURE],
          excludeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        },
        mode: "mix",
        modes: ["popular", "trending"],
      },
      {
        id: "movies-comedy",
        title: "Comedies",
        mediaType: "movie",
        filter: {
          includeGenreIds: [MOVIE_GENRES.COMEDY],
          excludeGenreIds: [MOVIE_GENRES.HORROR],
        },
        mode: "mix",
        modes: ["popular", "trending"],
        minVotes: 100,
      },
      {
        id: "movies-scifi",
        title: "Sci-fi & Fantasy",
        mediaType: "movie",
        filter: {
          includeGenreIds: [MOVIE_GENRES.SCIENCE_FICTION, MOVIE_GENRES.FANTASY],
          excludeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
        },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 200,
      },
    ],
  },

  tv: {
    id: "tv",
    label: "TV Shows",
    tmdbTitle: "The Office",
    mediaType: "tv",
    hero: {
      eyebrow: "Browse TV Shows",
      title: "Sitcoms, dramas, and bingeworthy series.",
      description:
        "From comfort rewatches to edge-of-your-seat dramas, find the next show to marathon.",
      gradient: "from-[#0B0D17] via-[#111827] to-[#00D8FF]",
    },

    // ✅ 4 rows
    rows: [
      {
        id: "tv-sitcoms",
        title: "Sitcoms",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.COMEDY],
          excludeGenreIds: EXCLUDE_TV_NON_SERIES,
          keywordQuery: "sitcom",
        },
        mode: "mix",
        modes: ["popular", "trending"],
      },
      {
        id: "tv-crime",
        title: "Crime & Mystery",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.CRIME, TV_GENRES.MYSTERY],
          excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 200,
      },
      {
        id: "tv-dramas",
        title: "Drama",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.DRAMA],
          excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 200,
      },
      {
        id: "tv-scifi",
        title: "Sci-fi & Fantasy",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.SCI_FI_FANTASY],
          excludeGenreIds: EXCLUDE_TV_NON_SERIES,
        },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 150,
      },
    ],
  },

  animation: {
    id: "animation",
    label: "Animation",
    tmdbTitle: "Akira",
    mediaType: "movie",
    hero: {
      eyebrow: "Browse Animation",
      title: "Family favorites, anime, and more.",
      description:
        "Cue up cozy family nights, iconic animated movies, or your favorite anime worlds.",
      gradient: "from-[#0B0D17] via-[#241336] to-[#AB8BFF]",
    },

    // ✅ 4 rows
    rows: [
      {
        id: "anim-family",
        title: "Family Picks",
        mediaType: "movie",
        filter: {
          includeGenreIds: [MOVIE_GENRES.ANIMATION, MOVIE_GENRES.FAMILY],
          requireAllInclude: true,
          certificationCountry: "US",
          certificationLte: "PG-13",
        },
        mode: "mix",
        modes: ["popular", "trending"],
      },
      {
        id: "anime-tv",
        title: "Anime Series",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.ANIMATION],
          originalLanguage: "ja",
          keywordQuery: "anime",
          excludeGenreIds: [TV_GENRES.TALK, TV_GENRES.NEWS, TV_GENRES.REALITY],
        },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 200,
      },
      {
        id: "anim-series",
        title: "Animated Shows",
        mediaType: "tv",
        filter: {
          includeGenreIds: [TV_GENRES.ANIMATION],
          excludeGenreIds: [TV_GENRES.TALK, TV_GENRES.NEWS, TV_GENRES.REALITY],
        },
        mode: "mix",
        modes: ["popular", "trending"],
      },
      {
        id: "anim-movies",
        title: "Animated Movies",
        mediaType: "movie",
        filter: { includeGenreIds: [MOVIE_GENRES.ANIMATION] },
        mode: "mix",
        modes: ["popular", "top_rated", "trending"],
        minVotes: 300,
      },
    ],
  },
};

const TAB_ROUTE = {
  movies: "/search?tab=movie",
  tv: "/search?tab=tv",
  animation: "/search?tab=animation",
};

const BrowseSection = ({ onOpenDetails }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("movies");
  const [heroBackgrounds, setHeroBackgrounds] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const activeConfig = useMemo(() => {
    return BROWSE_TABS[activeTab] ?? BROWSE_TABS.movies;
  }, [activeTab]);

  // Fetch hero backdrops once
  useEffect(() => {
    let cancelled = false;

    const loadBackdrops = async () => {
      const backgroundsByTabId = {};

      for (const [tabId, tabConfig] of Object.entries(BROWSE_TABS)) {
        try {
          const backdropPath = await getBackdropPathForTitle(
            tabConfig.tmdbTitle,
            tabConfig.mediaType,
          );

          backgroundsByTabId[tabId] = backdropPath
            ? `https://image.tmdb.org/t/p/original${backdropPath}`
            : null;
        } catch (error) {
          console.error("Error loading browse backdrop for", tabId, error);
          backgroundsByTabId[tabId] = null;
        }
      }

      if (!cancelled) setHeroBackgrounds(backgroundsByTabId);
    };

    loadBackdrops();
    return () => {
      cancelled = true;
    };
  }, []);

  // Small loading window for smoother transition
  useEffect(() => {
    if (!isLoading) return;
    const timeoutId = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleTabChange = (nextTabId) => {
    if (nextTabId === activeTab) return;
    setIsLoading(true);
    setActiveTab(nextTabId);
  };

  return (
    <section className="w-full bg-cine-bg">
      {/* HERO AREA */}
      <div className="relative w-full overflow-hidden">
        <div
          className={`
            absolute inset-0 bg-cover bg-center bg-no-repeat
            transition-opacity duration-300
            ${isLoading ? "opacity-0" : "opacity-100"}
          `}
          style={{
            backgroundImage: heroBackgrounds[activeTab]
              ? `url(${heroBackgrounds[activeTab]})`
              : "none",
          }}
        />

        <div
          className={`
            absolute inset-0 bg-gradient-to-br
            ${activeConfig.hero.gradient}
            opacity-75 md:opacity-80
          `}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="flex gap-6 text-sm font-medium text-white/70 mb-6">
            {Object.values(BROWSE_TABS).map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    pb-2 relative transition-colors
                    ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-[2px] h-[3px] w-10 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-2">
            {activeConfig.hero.eyebrow}
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-xl">
            {activeConfig.hero.title}
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mb-6">
            {activeConfig.hero.description}
          </p>

          <button
            type="button"
            onClick={() => navigate(TAB_ROUTE[activeTab] ?? "/search")}
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-full
              bg-white text-cine-bg font-semibold text-sm
              shadow-lg shadow-black/40
              hover:bg-slate-100
              transition-colors
            "
          >
            Explore {activeConfig.label.toLowerCase()}
          </button>
        </div>
      </div>

      {/* ROWS */}
      <div className="pb-10">
        {activeConfig.rows.map((row, index) => (
          <BrowseRow
            key={row.id}
            title={row.title}
            mediaType={row.mediaType}
            filter={row.filter}
            mode={row.mode}
            modes={row.modes}
            minVotes={row.minVotes}
            direction={index % 2 === 0 ? "left" : "right"}
            browseLink={`/search?genre=${row.filter?.includeGenreIds?.[0]}&type=${row.mediaType}`}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default BrowseSection;
