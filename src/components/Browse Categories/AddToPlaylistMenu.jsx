import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Check } from "lucide-react";
import { useKey } from "../../hooks/useKey";

const AddToPlaylistMenu = ({ anchorRef, onAddToCollection, onClose, inWatchlist = false }) => {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [menuWidth, setMenuWidth] = useState(180);

  const updatePosition = () => {
    const anchorEl = anchorRef?.current;
    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    // Anchor to the trigger's top-right, then translate the menu up/left.
    // Clamp so the menu never goes off-screen on narrow phones.
    const margin = 8;
    const viewportW = window.innerWidth || 0;
    const clampedLeft = Math.min(
      Math.max(rect.right, menuWidth + margin),
      Math.max(margin, viewportW - margin),
    );

    setPos({ top: rect.top, left: clampedLeft });
  };

  useLayoutEffect(() => {
    if (menuRef.current) {
      const w = menuRef.current.getBoundingClientRect().width;
      if (Number.isFinite(w) && w > 0) setMenuWidth(w);
    }
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorRef]);

  useEffect(() => {
    if (!anchorRef?.current) return;

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorRef, menuWidth]);

  useKey("Escape", () => onClose?.());

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!menuRef.current?.contains(e.target)) onClose?.();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Add to collection"
      data-playlist-menu
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translate(-100%, calc(-100% - 8px))",
      }}
      className="
        z-[9999]
        min-w-[150px] sm:min-w-[180px]
        w-[min(180px,calc(100vw-16px))]
        rounded-lg
        border border-cine-highlight/70
        bg-cine-scope/95 backdrop-blur
        shadow-xl
      "
    >
      {/* arrow */}
      <div
        className="
          absolute -bottom-2 right-3
          h-3 w-3 rotate-45
          bg-cine-bg/95
          border-r border-b border-white/10
        "
      />

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onAddToCollection?.();
          onClose?.();
        }}
        className="
          w-full flex items-center gap-2
          px-3 py-2
          text-sm text-white/90
          hover:bg-white/10 hover:text-white
          transition-colors
          rounded-lg
        "
      >
        {inWatchlist ? <Check className="h-4 w-4 text-cine-highlight" /> : <Plus className="h-4 w-4" />}
        {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>
    </div>,
    document.body,
  );
};

export default AddToPlaylistMenu;
