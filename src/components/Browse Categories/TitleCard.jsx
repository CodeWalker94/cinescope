import { useRef } from "react";
import { MdImageNotSupported } from "react-icons/md";
import AddToPlaylistMenu from "./AddToPlaylistMenu";
import { getTitle } from "../../utils/titleHelpers";

const buildPosterUrl = (posterPath) =>
  posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : null;

const TitleCard = ({
  item,
  mediaType = "movie",
  onOpenDetails,
  onOpenMenu, // optional parent hook
  isMenuOpen = false,
  isActive = false,
  onActivate,
  onToggleMenu,
  onCloseMenu,
}) => {
  const posterUrl = buildPosterUrl(item?.poster_path);
  const title = getTitle(item);
  const menuButtonRef = useRef(null);

  const handleOpenDetails = () => {
    if (typeof onActivate === "function") onActivate();
    if (typeof onOpenDetails === "function") {
      onOpenDetails({ item, mediaType });
    }
  };

  const handleToggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof onToggleMenu === "function") {
      onToggleMenu();
    }

    if (typeof onOpenMenu === "function") {
      onOpenMenu({ item, mediaType });
    }
  };

  const handleCloseMenu = () => {
    if (typeof onCloseMenu === "function") onCloseMenu();
  };

  return (
    <div
      className="
        group relative
        w-[44vw] max-w-[190px]
        sm:w-[30vw] sm:max-w-[210px]
        md:w-[220px]
        lg:w-[230px]
        shrink-0
        snap-start
        rounded-2xl
        bg-white/5
        transition-colors duration-300
        hover:bg-white/10
        overflow-visible
      "
    >
      {/* Main click target */}
      <button
        type="button"
        aria-label={title}
        onPointerDown={() => {
          if (typeof onActivate === "function") onActivate();
        }}
        onClick={handleOpenDetails}
        className="
          absolute inset-0 z-[1]
          focus:outline-none
          focus-visible:ring-inset
          focus-visible:ring-4
          focus-visible:ring-cine-highlight/80
        "
      />

      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-cine-accent to-cine-scope flex flex-col items-center justify-center gap-2 p-3">
            <MdImageNotSupported className="text-white/30 text-4xl shrink-0" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center leading-tight">
              No Poster
            </span>
            <span className="text-white text-xs font-bold text-center line-clamp-3 leading-snug">
              {title}
            </span>
          </div>
        )}

        {/* Hover glow */}
        <div
          className={`
            pointer-events-none absolute inset-0
            opacity-0
            md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-active:opacity-100
            transition-opacity duration-300
            bg-gradient-to-tr
            from-cine-highlight/20
            via-cine-highlight/5
            to-transparent
            ${isMenuOpen ? "opacity-100" : ""}
            ${isActive ? "max-md:opacity-100" : ""}
          `}
        />
      </div>

      {/* Glow border */}
      <div
        className={`
          pointer-events-none absolute inset-0
          rounded-2xl
          opacity-0
          md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-active:opacity-100
          transition-opacity duration-300
          ring-inset ring-4 ring-cine-highlight/80
          ${isMenuOpen ? "opacity-100" : ""}
          ${isActive ? "max-md:opacity-100" : ""}
        `}
      />

      {/* 3-dot menu + popup */}
      <div
        className={
          isMenuOpen
            ? "absolute right-2 top-2 z-[2] opacity-100 transition-opacity duration-300"
            : "absolute right-2 top-2 z-[2] opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-active:opacity-100 transition-opacity duration-300"
        }
      >
        <div className="relative">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={`More options for ${title}`}
            onPointerDown={(e) => {
              // Prevent the global outside-click handler from firing when
              // tapping the trigger (so the button truly toggles).
              e.stopPropagation();
              if (typeof onActivate === "function") onActivate();
            }}
            onClick={handleToggleMenu}
            className="
              h-9 w-9
              rounded-full
              bg-black/45 border border-white/10
              text-white/80
              hover:text-white hover:bg-black/60
              backdrop-blur
              transition-colors
              flex items-center justify-center
            "
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {isMenuOpen && (
            <AddToPlaylistMenu
              anchorRef={menuButtonRef}
              onClose={handleCloseMenu}
              onAddToCollection={() => {
                console.log("Add to collection:", {
                  id: item?.id,
                  mediaType,
                  title,
                });
              }}
              // onAddToWatchlist={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
