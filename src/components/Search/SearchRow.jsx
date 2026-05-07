import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TitleCard from "../Browse Categories/TitleCard.jsx";
import SkeletonCard from "../Browse Categories/SkeletonCard.jsx";

const CARDS_PER_ROW = 20;

const SearchRow = ({
  title,
  items = [],
  isLoading,
  hasError,
  onOpenDetails,
}) => {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const isSyncing = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openMenuItemId, setOpenMenuItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  const row1Items = items.slice(0, CARDS_PER_ROW);
  const row2Items = items.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2);
  const skeletons = Array.from({ length: CARDS_PER_ROW });

  const updateScrollButtons = () => {
    const el = row1Ref.current;
    if (!el) return;
    const epsilon = 2;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > epsilon);
    setCanScrollRight(el.scrollLeft < maxLeft - epsilon);
  };

  const scrollByAmount = (dir) => {
    const amount =
      Math.round((row1Ref.current?.clientWidth ?? 300) * 0.85) * dir;
    row1Ref.current?.scrollBy({ left: amount, behavior: "smooth" });
    row2Ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const syncScroll = (source, target) => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    target.scrollLeft = source.scrollLeft;
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  };

  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1) return;

    const raf = requestAnimationFrame(updateScrollButtons);
    const t = setTimeout(updateScrollButtons, 150);

    const onScroll1 = () => {
      updateScrollButtons();
      if (r2) syncScroll(r1, r2);
    };
    const onScroll2 = () => {
      if (r1) syncScroll(r2, r1);
    };

    r1.addEventListener("scroll", onScroll1, { passive: true });
    r2?.addEventListener("scroll", onScroll2, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      r1.removeEventListener("scroll", onScroll1);
      r2?.removeEventListener("scroll", onScroll2);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items.length]);

  const renderStrip = (ref, stripItems) => (
    <div
      ref={ref}
      className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {isLoading
        ? skeletons.map((_, i) => <SkeletonCard key={i} />)
        : stripItems.map((item, i) => (
            <TitleCard
              key={item?.id ?? i}
              item={item}
              mediaType={item?.media_type || "movie"}
              onOpenDetails={onOpenDetails}
              isMenuOpen={openMenuItemId === item?.id}
              isActive={activeItemId === item?.id}
              onActivate={() => setActiveItemId(item?.id)}
              onToggleMenu={() =>
                setOpenMenuItemId((prev) => {
                  const next = prev === item?.id ? null : item?.id;
                  setActiveItemId(item?.id);
                  return next;
                })
              }
              onCloseMenu={() => setOpenMenuItemId(null)}
            />
          ))}
      <div aria-hidden className="shrink-0 w-10 sm:w-12 md:w-16" />
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative max-w-7xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-white text-xl sm:text-2xl font-semibold">
          {title}
        </h2>
        {isLoading && (
          <span className="text-xs text-white/50 sr-only">Loading…</span>
        )}
        {hasError && (
          <span className="text-xs text-red-300">Couldn't load.</span>
        )}
      </div>

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-24 w-10 sm:w-11 md:w-12 items-center justify-center rounded-none rounded-r-2xl bg-cine-highlight/75 hover:bg-cine-highlight/90 text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll left"
        >
          <span className="text-3xl font-black leading-none">‹</span>
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-24 w-10 sm:w-11 md:w-12 items-center justify-center rounded-none rounded-l-2xl bg-cine-scope/75 hover:bg-cine-scope/90 text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll right"
        >
          <span className="text-3xl font-black leading-none">›</span>
        </button>
      )}

      {/* Two synced rows */}
      <div className="flex flex-col gap-3">
        {renderStrip(row1Ref, row1Items)}
        {(isLoading || row2Items.length > 0) && renderStrip(row2Ref, row2Items)}
      </div>
    </motion.section>
  );
};

export default SearchRow;
