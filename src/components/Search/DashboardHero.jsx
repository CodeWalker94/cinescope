import { useEffect, useState } from "react";
import { getTrendingTitles } from "../../API/tmdb";
import { shuffle } from "../../utils/titleHelpers";

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const FADE_MS = 700;
const HOLD_MS = 4200;

// ─── Hook: fetch top-20 trending, split into left (1-10) and right (11-20) ───
const useTrendingPosters = () => {
  const [leftUrls, setLeftUrls] = useState([]);
  const [rightUrls, setRightUrls] = useState([]);

  useEffect(() => {
    let alive = true;

    getTrendingTitles("all", "week", 1)
      .then((results) => {
        if (!alive) return;
        const withPosters = results.filter((r) => r.poster_path);
        const toUrl = (r) => `${POSTER_BASE}${r.poster_path}`;
        // Shuffle each half independently so the two sides rotate differently
        setLeftUrls(shuffle(withPosters.slice(0, 10).map(toUrl)));
        setRightUrls(shuffle(withPosters.slice(10, 20).map(toUrl)));
      })
      .catch(() => {}); // silent fail — hero just shows empty panels

    return () => {
      alive = false;
    };
  }, []);

  return { leftUrls, rightUrls };
};

// ─── Single cycling poster ────────────────────────────────────────────────────
const FadingPoster = ({ urls }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (urls.length < 2) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % urls.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS + FADE_MS);
    return () => clearInterval(timer);
  }, [urls]);

  if (!urls.length) return <div className="w-full h-full bg-white/5" />;

  return (
    <img
      src={urls[index]}
      alt=""
      className="w-full h-full object-cover object-top"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
      }}
    />
  );
};

// ─── DashboardHero ────────────────────────────────────────────────────────────
//
//  Three-div layout:
//  ┌──────────────┬──────────────────────────┬──────────────┐
//  │  LEFT POSTER │   CENTER OVERLAY (text)  │ RIGHT POSTER │
//  │   z-10       │         z-20 / z-30      │    z-10      │
//  └──────────────┴──────────────────────────┴──────────────┘
//
const DashboardHero = () => {
  const { leftUrls, rightUrls } = useTrendingPosters();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", marginTop: "-64px" }}
    >
      {/* ── 1. Dark base + cinescope accent glows ─────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(42,57,255,0.25) 0%, transparent 65%)," +
            "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(109,40,217,0.25) 0%, transparent 65%)," +
            "#0b0d17",
        }}
      />

      {/* ── 2a. LEFT poster div — fills left half ─────────────────── */}
      <div className="absolute left-0 top-0 h-full z-10 w-1/2">
        <FadingPoster urls={leftUrls} />
      </div>

      {/* ── 2b. RIGHT poster div — fills right half ───────────────── */}
      <div className="absolute right-0 top-0 h-full z-10 w-1/2">
        <FadingPoster urls={rightUrls} />
      </div>

      {/* ── 3. CENTER overlay — owns ALL blending ─────────────────────── */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            // wider, deeper dark ellipse — covers more of the inner poster edges
            "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(11,13,23,0.98) 30%, rgba(11,13,23,0.92) 52%, rgba(11,13,23,0.55) 70%, rgba(11,13,23,0.15) 83%, transparent 95%)," +
            // top scrim — bleed under sticky header
            "linear-gradient(to bottom, #0b0d17 0%, transparent 16%)," +
            // bottom scrim — flow into page content
            "linear-gradient(to top, #0b0d17 0%, transparent 28%)",
        }}
      />

      {/* ── 4. Text content ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-8"
        style={{ paddingTop: "64px" }}
      >
        <p
          className="font-semibold uppercase mb-4"
          style={{
            fontSize: "clamp(0.6rem, 0.9vw, 0.8rem)",
            letterSpacing: "0.22em",
            color: "#00d8ff",
            opacity: 0.9,
          }}
        >
          Your streaming universe
        </p>
        <h1
          className="text-white leading-[1.02] mb-5"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 6.5vw, 6rem)",
            textShadow: "0 4px 32px rgba(0,0,0,0.8)",
            maxWidth: "clamp(320px, 44vw, 680px)",
          }}
        >
          Browse thousands of
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg, #97efff 0%, #2a39ff 50%, #6d28d9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            movies &amp; shows
          </span>
        </h1>
        <p
          className="leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
            maxWidth: "440px",
          }}
        >
          Pick a genre, explore curated rows,
          <br className="hidden sm:block" />
          or search across our entire catalog.
        </p>
      </div>
    </div>
  );
};

export default DashboardHero;
