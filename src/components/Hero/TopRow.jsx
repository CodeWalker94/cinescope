import TopRowCard from "./TopRowCard";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { getTitleDetails } from "../../API/tmdb";

const TopRow = ({ trending, onChangeHero }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Cache of full details keyed by TMDB id (not UI state — useRef avoids re-renders)
  const detailsCacheRef = useRef({});

  // Ref to the whole section (for visibility)
  const sectionRef = useRef(null);
  // Ref only for the horizontal row (for scrollToIndex)
  const rowRef = useRef(null);

  // Track if the TopRow section is actually on screen
  const [isRowVisible, setIsRowVisible] = useState(true);

  // Watch visibility of the section
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRowVisible(true);
          } else {
            // Only pause when the user has scrolled PAST the section (it's above
            // the viewport). If it's below the fold (not yet reached), keep rotating
            // so the Hero above it keeps updating.
            const scrolledPast = entry.boundingClientRect.bottom < 0;
            setIsRowVisible(!scrolledPast);
          }
        });
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll only the carousel row, and center the card
  const scrollToIndex = useCallback((index) => {
    const container = rowRef.current;
    if (!container) return;

    const card = container.querySelector(`#card-${index}`);
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;

    const delta = cardCenter - containerCenter;

    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: "smooth",
    });
  }, []);

  // Ensure the first/last cards can fully show on narrow screens.
  // We dynamically set horizontal padding based on the active card width
  // so scroll-snap center doesn't start clipped.
  useLayoutEffect(() => {
    const container = rowRef.current;
    if (!container) return;

    // Only needed on small screens. On desktop/laptop this padding creates
    // excessive empty space and makes the row feel "over-snapped".
    const isSmall =
      typeof window !== "undefined" &&
      window.matchMedia?.("(max-width: 768px)")?.matches;

    if (!isSmall) {
      container.style.removeProperty("--carousel-edge-padding");
      return;
    }

    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;

    const updateEdgePadding = () => {
      const card = container.querySelector(`#card-${activeIndex}`);
      if (!(card instanceof Element)) return;

      const containerW = container.clientWidth;

      // IMPORTANT:
      // The active card grows via CSS transform + transition, so measuring once
      // immediately can catch the pre-transition size. We re-measure below.
      const cardW = card.getBoundingClientRect().width;

      // Add a small safety margin so the first/last card never kisses the edge.
      const margin = 12;
      const pad = Math.max(0, Math.floor((containerW - cardW) / 2) + margin);

      container.style.setProperty("--carousel-edge-padding", `${pad}px`);
    };

    updateEdgePadding();

    // Re-measure after style/layout settles and after the transform transition.
    raf1 = requestAnimationFrame(() => {
      updateEdgePadding();
      raf2 = requestAnimationFrame(updateEdgePadding);
    });

    timeoutId = window.setTimeout(updateEdgePadding, 360);

    window.addEventListener("resize", updateEdgePadding);
    return () => {
      window.removeEventListener("resize", updateEdgePadding);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeIndex, trending?.length]);

  // Load full hero details when activeIndex changes
  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const movies = trending.slice(0, 5);
    const movie = movies[activeIndex];
    if (!movie) return;

    let cancelled = false;

    const loadDetails = async () => {
      const cached = detailsCacheRef.current[movie.id];
      if (cached) {
        onChangeHero(cached);
        return;
      }

      try {
        const mediaType =
          movie.media_type || (movie.first_air_date ? "tv" : "movie");

        const details = await getTitleDetails(movie.id, mediaType);

        if (cancelled) return;

        detailsCacheRef.current[movie.id] = details;

        onChangeHero(details);
      } catch (err) {
        console.error("Error loading title details", err);
        if (!cancelled) {
          onChangeHero(movie);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [activeIndex, trending, onChangeHero]);

  // When user clicks a card / dot
  const handleActive = (index) => {
    setIsAutoPlaying(false); // stop auto-rotate once user interacts
    setActiveIndex(index);

    setTimeout(() => {
      scrollToIndex(index);
    }, 320);
  };

  // Auto-rotate the row itself (only when visible & allowed)
  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const movies = trending.slice(0, 5);
    if (movies.length <= 1) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;
    if (!isAutoPlaying) return;
    if (!isRowVisible) return; // 🔑 pause when user has scrolled past

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % movies.length;

        setTimeout(() => {
          scrollToIndex(next);
        }, 320);

        return next;
      });
    }, 8000);

    return () => clearInterval(intervalId);
  }, [trending, isAutoPlaying, isRowVisible, scrollToIndex]);

  const movies = trending?.slice(0, 5) ?? [];

  return (
    <section ref={sectionRef} className="trending-section">
      <h2 className="trending-title text-2xl font-bold ml-4">
        Top Trending Now
      </h2>

      <div ref={rowRef} className="carousel-row">
        {movies.map((movie, idx) => (
          <TopRowCard
            key={movie.id}
            movie={movie}
            isActive={idx === activeIndex}
            index={idx}
            onClick={() => handleActive(idx)}
          />
        ))}
      </div>

      <div className="mb-3 mt-2 flex flex-col items-center gap-2">
        <div className="flex justify-center gap-2">
          {movies.map((movie, idx) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => handleActive(idx)}
              aria-label={`Go to ${movie.title || movie.name || "slide"} ${
                idx + 1
              }`}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className="text-[0.7rem] text-cine-muted hover:text-white"
        >
          {isAutoPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
        </button>
      </div>
    </section>
  );
};

export default TopRow;
