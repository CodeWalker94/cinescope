import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsDown, ThumbsUp, X, Plus, Check } from "lucide-react";

import { useModalData } from "../../hooks/useModalData";
import { useKey } from "../../hooks/useKey";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../../utils/watchlistStorage";
import toast from "react-hot-toast";

const TMDB_IMG_W185 = "https://image.tmdb.org/t/p/w185";

// eslint doesn't always mark `motion.*` JSX member expressions as “used”
// unless we reference `motion` in normal JS.
const MotionDiv = motion.div;

const IconButton = ({ active, label, onClick, children }) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        h-10 w-10 rounded-full
        border backdrop-blur
        transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60
        ${
          active
            ? "bg-cine-highlight/15 border-cine-highlight/60 text-white"
            : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10"
        }
      `}
    >
      {children}
    </button>
  );
};

const CastChip = ({ person }) => {
  const name = person?.name || "";
  const role = person?.character || "";
  const imgUrl = person?.profile_path
    ? `${TMDB_IMG_W185}${person.profile_path}`
    : null;

  return (
    <div className="shrink-0 w-[130px] xs:w-[140px] sm:w-[140px] md:w-[150px]">
      <div className="h-full rounded-xl overflow-hidden bg-white/5 border border-white/10 flex flex-col">
        <div className="aspect-[2/3] w-full shrink-0">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}
        </div>

        <div className="p-2 h-[64px] sm:h-[68px] flex flex-col justify-start">
          <p className="text-xs text-white font-semibold leading-snug line-clamp-2">
            {name}
          </p>
          {role && (
            <p className="mt-0.5 text-[11px] text-cine-muted leading-snug line-clamp-2">
              {role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, selection }) => {
  const panelRef = useRef(null);
  const overviewRef = useRef(null);

  const id = selection?.id;
  const mediaType = selection?.mediaType || "movie";

  // UI-only state — the data layer lives in the hook below
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [canExpandOverview, setCanExpandOverview] = useState(false);
  const [isCastExpanded, setIsCastExpanded] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const {
    details,
    isLoading,
    hasError,
    rating,
    handleThumbUp,
    handleThumbDown,
    titleText,
    yearText,
    backdropUrl,
    posterUrl,
    genresText,
    runtimeText,
    scoreText,
    cast,
  } = useModalData({ isOpen, id, mediaType, selection });

  const canExpandCast = cast.length > 4;
  const visibleCast = isCastExpanded ? cast : cast.slice(0, 4);

  // Reset UI state whenever a new title is opened
  useEffect(() => {
    if (!isOpen) return;
    setIsOverviewExpanded(false);
    setIsCastExpanded(false);
    setInWatchlist(isInWatchlist(id, mediaType));
  }, [isOpen, id, mediaType]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Close on ESC
  useKey("Escape", () => {
    if (isOpen) onClose?.();
  });

  const overviewText =
    details?.overview ||
    selection?.overview ||
    "No synopsis available for this title yet.";

  // Only show Show more/less when the clamped paragraph actually overflows.
  useEffect(() => {
    if (!isOpen) return;
    if (isOverviewExpanded) {
      setCanExpandOverview(true);
      return;
    }

    const measure = () => {
      const el = overviewRef.current;
      if (!el) return;
      const overflow = el.scrollHeight - el.clientHeight > 2;
      setCanExpandOverview(overflow);
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, isOverviewExpanded, overviewText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onClose?.()}
          />

          {/* Panel wrapper */}
          <div className="absolute inset-0 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <MotionDiv
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={titleText}
              className="
                relative w-full max-w-5xl lg:max-w-6xl
                max-h-[88vh]
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-cine-bg
                shadow-2xl
                flex flex-col
              "
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                aria-label="Close"
                onClick={() => onClose?.()}
                className="
                  absolute right-3 top-3 z-20
                  inline-flex items-center justify-center
                  h-10 w-10 rounded-full
                  bg-black/40 border border-white/10
                  text-white/85 hover:text-white hover:bg-black/55
                  backdrop-blur
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60
                "
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header / hero (only backdrop) */}
              <div className="relative shrink-0">
                <div className="relative h-[160px] sm:h-[190px] md:h-[210px]">
                  {backdropUrl ? (
                    <img
                      src={backdropUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-[50%_10%]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cine-scope/40 via-cine-bg to-cine-accent/30" />
                  )}

                  {/* Bottom gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/65 to-transparent" />
                </div>
              </div>

              {/* Body (INNER SCROLL lives here) */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 sm:px-6 pb-6">
                  {/* TOP ROW: Poster LEFT of Title/meta */}
                  <div className="pt-4 sm:pt-5">
                    <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[160px_minmax(0,1fr)_minmax(0,320px)] gap-x-4 gap-y-2 sm:gap-x-5 sm:gap-y-3 md:gap-x-6 md:gap-y-0 items-start">
                      {/* Poster (sits LEFT of Movie/Title, NOT in hero) */}
                      <div className="w-[140px] sm:w-[160px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl">
                        <div className="aspect-[2/3]">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={titleText}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full bg-white/5" />
                          )}
                        </div>
                      </div>

                      {/* Title + meta + actions */}
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                          {mediaType === "tv" ? "TV" : "Movie"}
                        </p>

                        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-white line-clamp-4 sm:line-clamp-2">
                          {titleText}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                          {yearText && (
                            <span className="hero-pill">{yearText}</span>
                          )}
                          {runtimeText && (
                            <span className="hero-pill">{runtimeText}</span>
                          )}
                          {scoreText && (
                            <span className="hero-pill">★ {scoreText}</span>
                          )}
                        </div>

                        {genresText && (
                          <p className="mt-2 text-xs sm:text-sm text-cine-muted line-clamp-2">
                            {genresText}
                          </p>
                        )}

                        {hasError && (
                          <p className="mt-3 text-sm text-white/70">
                            Couldn’t load full details right now.
                          </p>
                        )}

                        {/* Actions (directly BELOW title/meta and BELOW poster) */}
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          <IconButton
                            active={rating === "like"}
                            label="Thumbs up"
                            onClick={handleThumbUp}
                          >
                            <ThumbsUp className="h-5 w-5" />
                          </IconButton>

                          <IconButton
                            active={rating === "dislike"}
                            label="Thumbs down"
                            onClick={handleThumbDown}
                          >
                            <ThumbsDown className="h-5 w-5" />
                          </IconButton>

                          <button
                            type="button"
                            onClick={() => {
                              if (inWatchlist) {
                                removeFromWatchlist(id, mediaType);
                                setInWatchlist(false);
                                toast(`Removed "${titleText}" from your Watchlist`);
                              } else {
                                addToWatchlist({ id, mediaType, title: titleText, poster_path: details?.poster_path || selection?.poster_path });
                                setInWatchlist(true);
                                toast.success(`Added "${titleText}" to your Watchlist`);
                              }
                            }}
                            className="
                              inline-flex items-center gap-2
                              h-10 px-4 rounded-full
                              bg-white/5 border border-white/10
                              text-sm font-semibold text-white/90
                              hover:bg-white/10 hover:text-white
                              transition-colors
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60
                            "
                            aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                          >
                            {inWatchlist ? <Check className="h-4 w-4 text-cine-highlight" /> : <Plus className="h-4 w-4" />}
                            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                          </button>
                        </div>
                      </div>

                      {/* Cast column (desktop) */}
                      <div className="hidden md:block md:row-span-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">
                            Cast
                          </p>
                          <div className="flex items-center gap-3">
                            {isLoading && (
                              <span className="text-xs text-white/50">
                                Loading…
                              </span>
                            )}
                            {canExpandCast && (
                              <button
                                type="button"
                                className="text-xs text-cine-highlight hover:text-white transition-colors"
                                onClick={() => setIsCastExpanded((v) => !v)}
                              >
                                {isCastExpanded ? "Show less" : "Show more"}
                              </button>
                            )}
                          </div>
                        </div>

                        {cast.length > 0 ? (
                          <div
                            className={
                              isCastExpanded
                                ? "mt-3 grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1"
                                : "mt-3 grid grid-cols-2 gap-3"
                            }
                          >
                            {visibleCast.map((p) => (
                              <CastChip
                                key={p?.credit_id || p?.cast_id || p?.id}
                                person={p}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-white/60">
                            Cast information isn’t available for this title.
                          </p>
                        )}
                      </div>

                      {/* Overview (sits directly under poster + details) */}
                      <div className="col-span-2 md:col-span-2 md:col-start-1 md:mt-1.5 sm:mt-0 md:h-[340px]">
                        <p className="text-sm font-semibold text-white mb-2">
                          Overview
                        </p>

                        <p
                          ref={overviewRef}
                          className="text-sm text-white/80 leading-relaxed"
                          style={
                            isOverviewExpanded
                              ? undefined
                              : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 6,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }
                          }
                        >
                          {overviewText}
                        </p>

                        {canExpandOverview && (
                          <button
                            type="button"
                            className="mt-2 text-sm text-cine-highlight hover:text-white transition-colors"
                            onClick={() => setIsOverviewExpanded((v) => !v)}
                          >
                            {isOverviewExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cast (mobile: stays below Overview) */}
                  <div className="md:hidden mt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Cast</p>
                      <div className="flex items-center gap-3">
                        {isLoading && (
                          <span className="text-xs text-white/50">
                            Loading…
                          </span>
                        )}
                        {canExpandCast && (
                          <button
                            type="button"
                            className="text-xs text-cine-highlight hover:text-white transition-colors"
                            onClick={() => setIsCastExpanded((v) => !v)}
                          >
                            {isCastExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </div>

                    {cast.length > 0 ? (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {visibleCast.map((p) => (
                          <CastChip
                            key={p?.credit_id || p?.cast_id || p?.id}
                            person={p}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/60">
                        Cast information isn’t available for this title.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default Modal;
