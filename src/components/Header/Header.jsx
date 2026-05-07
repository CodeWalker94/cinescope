import Directory from "./Directory.jsx";
import Auth from "./Auth.jsx";
import Logo from "../Hero/Logo.jsx";
import Search from "../Search.jsx";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu.jsx";
import { useState, useEffect } from "react";

const Header = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup in case component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`grid grid-cols-3 items-center px-5 py-2 h-16 bg-transparent z-20 ${className}`}
    >
      <div className="header-overlay"></div>

      {/* LEFT */}
      <div className="flex justify-start items-center gap-2">
        {/* MOBILE HAMBURGER – transforms into X */}
        <button
          type="button"
          className="md:hidden relative z-40 inline-flex items-center justify-center p-2 rounded-md bg-black/40 border border-white/10"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                isMenuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:block">
          <Directory />
        </div>
      </div>

      {/* CENTER */}
      <div className="flex justify-center">
        <Logo />
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end whitespace-nowrap gap-3">
        {/* Desktop search */}
        <div className="hidden md:block max-w-[220px]">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={(term) =>
              navigate(`/search?q=${encodeURIComponent(term)}`)
            }
          />
        </div>

        <Auth />
      </div>

      {/* MOBILE MENU OVERLAY */}
      <MobileMenu
        isOpen={isMenuOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </header>
  );
};

export default Header;
