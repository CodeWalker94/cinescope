import { useEffect, useState } from "react";
import { getPosterPathForTitle } from "../../API/tmdb";
import { shuffle } from "../../utils/titleHelpers";

// Curated, static list – mix of movies, TV & animation
const MOSAIC_ITEMS = [
  // Movies
  { title: "Avengers: Endgame", mediaType: "movie" },
  { title: "The Dark Knight", mediaType: "movie" },
  { title: "Dune: Part Two", mediaType: "movie" },
  { title: "Oppenheimer", mediaType: "movie" },
  { title: "Barbie", mediaType: "movie" },
  { title: "Top Gun: Maverick", mediaType: "movie" },
  { title: "Spider-Man: No Way Home", mediaType: "movie" },
  { title: "Star Wars: The Force Awakens", mediaType: "movie" },
  { title: "Black Panther", mediaType: "movie" },
  { title: "John Wick: Chapter 4", mediaType: "movie" },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    mediaType: "movie",
  },
  { title: "Toy Story 3", mediaType: "movie" },

  // TV
  { title: "Stranger Things", mediaType: "tv" },
  { title: "The Last of Us", mediaType: "tv" },
  { title: "House of the Dragon", mediaType: "tv" },
  { title: "The Office", mediaType: "tv" },
  { title: "Wednesday", mediaType: "tv" },
  { title: "Game of Thrones", mediaType: "tv" },

  // Animation
  { title: "Spider-Man: Into the Spider-Verse", mediaType: "movie" },
  { title: "Spider-Man: Across the Spider-Verse", mediaType: "movie" },
  { title: "The Super Mario Bros. Movie", mediaType: "movie" },
  { title: "Frozen", mediaType: "movie" },
  {
    title: "Demon Slayer: Kimetsu no Yaiba – The Movie: Mugen Train",
    mediaType: "movie",
  },
  { title: "Elemental", mediaType: "movie" },

  // Extras / newer stuff
  { title: "Wonka", mediaType: "movie" },
  {
    title: "Mission: Impossible - Dead Reckoning Part One",
    mediaType: "movie",
  },
  { title: "Guardians of the Galaxy Vol. 3", mediaType: "movie" },
  { title: "Blue Beetle", mediaType: "movie" },
  { title: "One Piece", mediaType: "tv" }, // Netflix live action
  { title: "Godzilla Minus One", mediaType: "movie" },
];

const SHUFFLE_INTERVAL = 7000; 
const FADE_DURATION = 400; 
const buildImageUrl = (posterPath) =>
  posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : null;

const MovieMosaic = () => {
  const [posters, setPosters] = useState([]);
  const [visiblePosters, setVisiblePosters] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1) Fetch poster paths once from TMDB
  useEffect(() => {
    let cancelled = false;

    const loadPosters = async () => {
      try {
        const results = await Promise.all(
          MOSAIC_ITEMS.map(async (item) => {
            const posterPath = await getPosterPathForTitle(
              item.title,
              item.mediaType,
            );
            const url = buildImageUrl(posterPath);

            if (!url) return null;

            return {
              title: item.title,
              url,
            };
          }),
        );

        if (!cancelled) {
          const cleaned = results.filter(Boolean);
          setPosters(cleaned);
          setVisiblePosters(cleaned); // initial layout
        }
      } catch (err) {
        console.error("Error loading mosaic posters", err);
      }
    };

    loadPosters();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Every 7 seconds, fade out → shuffle → fade back in
  useEffect(() => {
    if (!posters.length) return;

    let timeoutId;

    const shuffleOnce = () => {
      // trigger fade-out
      setIsTransitioning(true);

      timeoutId = setTimeout(() => {
        const shuffled = shuffle(posters);
        setVisiblePosters(shuffled);
        // fade back in
        setIsTransitioning(false);
      }, FADE_DURATION);
    };

    const intervalId = setInterval(shuffleOnce, SHUFFLE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [posters]);

  if (!visiblePosters.length) {
    // Simple fallback while loading
    return <div className="w-full h-full bg-cine-bg" />;
  }

  return (
    <div
      style={{ overflowAnchor: "none" }} // Prevents browser from scroll anchoring
      className={`
        w-full h-full
        transition-opacity duration-500 ease-out
        ${isTransitioning ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* Center the tilted mosaic inside the section */}
      <div className="w-full h-full flex items-center justify-center">
        {/* This wrapper tilts & scales the whole wall */}
        <div className="origin-center -rotate-8 md:-rotate-5 scale-[1.2]">
          <div
            className="
              grid
              grid-cols-4
              sm:grid-cols-6
              md:grid-cols-8
              lg:grid-cols-10
              gap-[1px] sm:gap-[2px]
            "
          >
            {visiblePosters.map((item) => (
              <div
                key={item.title}
                className="
                  aspect-[2/3]
                  overflow-hidden
                  rounded-[3px] sm:rounded-[4px]
                "
              >
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieMosaic;
