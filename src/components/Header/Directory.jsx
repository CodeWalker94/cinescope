import { Link } from "react-router-dom";

const Directory = ({ layout = "horizontal" }) => {
  const baseClasses =
    "text-lg content-center font-medium text-[clamp(0.875rem,2vw,1rem)]";

  const layoutClasses =
    layout === "horizontal"
      ? "flex items-center gap-8"
      : "flex flex-col items-start gap-3";

  const linkClass =
    "text-white/80 hover:text-white transition-colors duration-150";

  return (
    <div>
      <ul className={`${layoutClasses} ${baseClasses}`}>
        <li>
          <Link to="/search?tab=movie" className={linkClass}>
            Movies
          </Link>
        </li>
        <li>
          <Link to="/search?tab=tv" className={linkClass}>
            TV Shows
          </Link>
        </li>
        <li>
          <Link to="/search?tab=animation" className={linkClass}>
            Animation
          </Link>
        </li>
        <li>
          <Link to="/watchlist" className={linkClass}>
            Watchlist
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Directory;
