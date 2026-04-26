import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="Go to CineScope home"
      className="inline-flex items-center justify-center no-underline rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
    >
      <span className="font-heading text-gradient-1 text-[clamp(1.6rem,8vw,3.5rem)] leading-none whitespace-nowrap">
        Cine<span className="text-gradient-2">Scope</span>
      </span>
    </Link>
  );
};

export default Logo;
