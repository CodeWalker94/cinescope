import { Link } from "react-router-dom";

const PRIMARY_LINKS = [
  { label: "Explore", to: "/search" },
  { label: "Movies", to: "/search?tab=movie" },
  { label: "TV Shows", to: "/search?tab=tv" },
  { label: "Animation", to: "/search?tab=animation" },
  { label: "Watchlist", to: "/search" },
  { label: "Plans", to: "/plans" },
];

const SECONDARY_LINKS = [
  { label: "Accessibility", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookie Settings", href: "#" },
  { label: "Help", href: "#" },
  { label: "Contact", href: "#" },
];

const year = new Date().getFullYear();
const language = "English";

const pillClassName =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors duration-200 hover:bg-cine-highlight/60 hover:text-cine-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60";

const secondaryPillClassName =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-cine-muted transition-colors duration-200 hover:bg-cine-highlight/60 hover:text-cine-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-white/5 bg-cine-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors duration-200 hover:bg-cine-highlight/60 hover:text-cine-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
            aria-label="Choose language"
          >
            <span className="text-white/80">Choose your language</span>
            <span className="ml-2 text-white">{language}</span>
            <span className="text-white/80" aria-hidden>
              ▾
            </span>
          </button>
        </div>

        <nav aria-label="Footer navigation" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={pillClassName}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer links" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {SECONDARY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={secondaryPillClassName}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 border-t border-cine-highlight/60 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-cine-muted">
              © {year} CineScope. Portfolio project UI.
            </p>

            <p className="text-xs text-cine-muted">
              Data provided by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-cine-muted hover:text-white underline underline-offset-4"
              >
                TMDB
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
