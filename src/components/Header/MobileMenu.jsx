import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Directory from "./Directory.jsx";
import Search from "../Search.jsx";

const MobileMenu = ({ isOpen, searchTerm, setSearchTerm, onSubmit, onClose }) => {
  return createPortal(
    <div
      className={`
        mobile-menu-overlay
        fixed inset-0 md:hidden z-[100]
        transition-all duration-300 origin-top
        ${isOpen
          ? "opacity-100 scale-y-100 pointer-events-auto"
          : "opacity-0 scale-y-90 pointer-events-none"}
      `}
    >
      {/* Backdrop — tap to close */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="
          absolute inset-0 w-full h-full
          bg-black/30
          bg-gradient-to-b from-white/10 via-white/5 to-transparent
          backdrop-blur-xl
        "
      />

      {/* Content sits above the backdrop */}
      <div className="relative h-full w-full px-5 pt-16 pb-4 overflow-y-auto">
        <div
          className="mt-2 space-y-6"
          onClick={(e) => {
            // Close on link clicks via event delegation; ignore everything else (e.g. typing in search)
            if (e.target.closest("a")) onClose?.();
          }}
        >
          <Directory layout="vertical" />

          <Link
            to="/search"
            className="block text-white/80 hover:text-white transition-colors duration-150 text-lg font-medium"
          >
            Browse
          </Link>

          <div className="w-full pt-1">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MobileMenu;
