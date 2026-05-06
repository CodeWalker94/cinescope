import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TitleCard from "./TitleCard";
import SkeletonCard from "./SkeletonCard";
import { useBrowseRowData } from "../../hooks/useBrowseRowData";

const BrowseRow = ({
  title,
  mediaType = "movie",

  /**
   * NEW FILTER SHAPE:
   * filter: {
   *   includeGenreIds: number[],
   *   excludeGenreIds: number[],
   *   originalLanguage?: string,
   *   keywordQuery?: string
   * }
   */
  filter = {},

  // "popular" | "top_rated" | "trending" | "mix"
  mode = "mix",
  modes = ["popular", "trending", "top_rated"],

  minVotes,
  direction = "left",

  onOpenDetails,
}) => {
  const rowRef = useRef(null);

  const { items, isLoading, hasError } = useBrowseRowData({
    title,
    mediaType,
    filter,
    mode,
    modes,
    minVotes,
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openMenuItemId, setOpenMenuItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // Mobile behavior: tapping outside the cards clears the active highlight.
  useEffect(() => {
    const onPointerDown = (e) => {
      // Only apply on small screens (Tailwind md breakpoint).
      if (typeof window === "undefined") return;
      if (!window.matchMedia?.("(max-width: 767px)")?.matches) return;

      const target = e.target;
      if (!(target instanceof Element)) return;

      // Ignore clicks inside the portal menu.
      if (target.closest("[data-playlist-menu]")) return;

      const strip = rowRef.current;
      if (!strip) return;

      // If click is outside this row's card strip, clear active state.
      if (!strip.contains(target)) {
        setActiveItemId(null);
        setOpenMenuItemId(null);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const updateScrollButtons = () => {
    const el = rowRef.current;
    if (!el) return;

    // Use a small epsilon to avoid off-by-one jitter
    const epsilon = 2;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > epsilon);
    setCanScrollRight(el.scrollLeft < maxLeft - epsilon);
  };

  const scrollByAmount = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    // Update arrows when items load / layout changes
    const raf = requestAnimationFrame(updateScrollButtons);
    const t1 = setTimeout(updateScrollButtons, 150);

    const el = rowRef.current;
    if (!el)
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
      };

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateScrollButtons());
      ro.observe(el);
    }

    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", updateScrollButtons);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      ro?.disconnect?.();
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items.length]);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-6">
      {/* Row header */}
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white text-lg sm:text-xl font-semibold">
            {title}
          </h3>
          {isLoading && (
            <span className="text-xs text-white/50 sr-only">Loading…</span>
          )}
          {hasError && (
            <span className="text-xs text-white/50">Couldn’t load.</span>
          )}
        </div>

        <button
          type="button"
          className="text-xs sm:text-sm text-cine-muted hover:text-white transition-colors"
        >
          Browse more →
        </button>
      </div>

      {/* Arrows */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 sm:h-20 sm:w-11 md:h-24 md:w-12 items-center justify-center rounded-none rounded-r-2xl bg-cine-highlight/75 hover:bg-cine-highlight/90 text-white/90 hover:text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll left"
        >
          <span className="text-2xl sm:text-3xl leading-none font-black">
            ‹
          </span>
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 sm:h-20 sm:w-11 md:h-24 md:w-12 items-center justify-center rounded-none rounded-l-2xl bg-cine-scope/75 hover:bg-cine-scope/90 text-white/90 hover:text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll right"
        >
          <span className="text-2xl sm:text-3xl leading-none font-black">
            ›
          </span>
        </button>
      )}

      {/* Scroll strip */}
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-60px" }}
        className="relative flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-4 scroll-px-4"
      >
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : items.map((item) => (
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
        <div aria-hidden className="shrink-0 w-10 sm:w-12 md:w-16" />
      </motion.div>
    </section>
  );
};

export default BrowseRow;
