import { useEffect, useMemo, useState } from "react";
import { discoverTitles, getTrendingTitles } from "../API/tmdb";
import { shuffle } from "../utils/titleHelpers";

const MAX_ITEMS = 16;
const ROW_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Module-level: lives outside the component so it survives re-renders and re-mounts.
const rowResultCache = new Map();

function getFreshCachedRow(key) {
  const entry = rowResultCache.get(key);
  if (!entry || !entry.data) return null;
  if (Date.now() - entry.ts > ROW_CACHE_TTL_MS) return null;
  return entry.data;
}

// Stores the in-flight promise immediately so a second caller with the same key
// joins the existing request instead of firing a duplicate one.
async function fetchRowWithCache(key, fetcher) {
  const existing = rowResultCache.get(key);
  if (existing?.promise) return existing.promise;

  const promise = (async () => {
    const data = await fetcher();
    rowResultCache.set(key, { ts: Date.now(), data });
    return data;
  })().catch((err) => {
    rowResultCache.delete(key);
    throw err;
  });

  rowResultCache.set(key, { ts: Date.now(), promise });
  return promise;
}

// --- Pure helper functions ---

function uniqueById(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (!item?.id) continue;
    const key = String(item.id);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function getPrimaryGenreId(item) {
  const ids = item?.genre_ids;
  if (!Array.isArray(ids) || ids.length === 0) return null;
  return ids[0];
}

// Three strictness modes for genre matching:
//   requireAllInclude → item must have every included genre
//   allowMixed        → item just needs any one included genre
//   default (strict)  → item's primary (first) genre must be in the include list
function filterByShelfRules(
  items,
  {
    includeGenreIds,
    excludeGenreIds,
    allowMixed = false,
    requireAllInclude = false,
  },
) {
  const include = Array.isArray(includeGenreIds) ? includeGenreIds : [];
  const exclude = Array.isArray(excludeGenreIds) ? excludeGenreIds : [];

  return items.filter((item) => {
    const ids = Array.isArray(item?.genre_ids) ? item.genre_ids : [];

    if (exclude.length > 0 && ids.some((g) => exclude.includes(g)))
      return false;

    if (include.length > 0) {
      if (requireAllInclude) return include.every((g) => ids.includes(g));
      if (allowMixed) return ids.some((g) => include.includes(g));
      const primary = getPrimaryGenreId(item);
      return primary != null && include.includes(primary);
    }

    return true;
  });
}

// Blends three shuffled buckets with weighted random selection (50/30/20).
// Falls back to any non-empty bucket if the chosen one is exhausted.
function buildWeightedMix({ popular, trending, topRated }, limit = MAX_ITEMS) {
  const weights = { popular: 0.5, trending: 0.3, topRated: 0.2 };
  const buckets = {
    popular: shuffle(popular),
    trending: shuffle(trending),
    topRated: shuffle(topRated),
  };

  const out = [];
  while (out.length < limit) {
    const totalLeft =
      buckets.popular.length +
      buckets.trending.length +
      buckets.topRated.length;
    if (totalLeft === 0) break;

    const roll = Math.random();
    let pick = "popular";
    if (roll < weights.popular) pick = "popular";
    else if (roll < weights.popular + weights.trending) pick = "trending";
    else pick = "topRated";

    if (buckets[pick].length === 0) {
      if (buckets.popular.length) pick = "popular";
      else if (buckets.trending.length) pick = "trending";
      else pick = "topRated";
    }

    const next = buckets[pick].shift();
    if (next) out.push(next);
  }

  return uniqueById(out).slice(0, limit);
}

// Fetches pages sequentially until `needed` items are collected or `maxPages` is hit.
// Stops early to avoid unnecessary requests.
async function collectEnoughPages(fetchPageFn, { maxPages = 3, needed = 24 }) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const results = await fetchPageFn(page);
    all.push(...(results ?? []));
    if (all.length >= needed) break;
  }
  return all;
}

/**
 * Fetches, filters, and caches the items for a BrowseRow.
 * Extracted so BrowseRow itself only needs to handle UI (scroll, arrows, menus).
 */
export function useBrowseRowData({
  title,
  mediaType,
  filter,
  mode,
  modes,
  minVotes,
}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Destructure filter fields so deps reference primitives/arrays, not the object itself.
  // A new object reference every render would cause effects and memos to re-run unnecessarily.
  const includeGenreIds = filter?.includeGenreIds;
  const excludeGenreIds = filter?.excludeGenreIds;
  const allowMixed = filter?.allowMixed ?? false;
  const requireAllInclude = filter?.requireAllInclude ?? false;
  const originalLanguage = filter?.originalLanguage;
  const keywordQuery = filter?.keywordQuery;
  const certificationCountry = filter?.certificationCountry;
  const certificationLte = filter?.certificationLte;

  const effectiveMinVotes =
    typeof minVotes === "number" ? minVotes : mediaType === "tv" ? 200 : 500;

  const hasShelf = Array.isArray(includeGenreIds) && includeGenreIds.length > 0;

  const requestKey = useMemo(() => {
    const includeKey = Array.isArray(includeGenreIds)
      ? includeGenreIds.join(",")
      : "";
    const excludeKey = Array.isArray(excludeGenreIds)
      ? excludeGenreIds.join(",")
      : "";
    const modesKey = Array.isArray(modes) ? modes.join("|") : "";
    return [
      title,
      mediaType,
      mode,
      modesKey,
      includeKey,
      excludeKey,
      allowMixed ? "mixed" : "strict",
      requireAllInclude ? "all" : "any",
      certificationCountry ?? "",
      certificationLte ?? "",
      String(effectiveMinVotes),
      originalLanguage ?? "",
      keywordQuery ?? "",
    ].join("::");
  }, [
    title,
    mediaType,
    mode,
    modes,
    includeGenreIds,
    excludeGenreIds,
    allowMixed,
    requireAllInclude,
    certificationCountry,
    certificationLte,
    effectiveMinVotes,
    originalLanguage,
    keywordQuery,
  ]);

  useEffect(() => {
    let cancelled = false;

    // Serve from cache when possible — no API call needed
    const cached = getFreshCachedRow(requestKey);
    if (cached) {
      setHasError(false);
      setIsLoading(false);
      setItems(cached);
      return () => {
        cancelled = true;
      };
    }

    const loadDiscoverPaged = async (sortBy, maxPages = 1) => {
      const raw = await collectEnoughPages(
        (page) =>
          discoverTitles({
            mediaType,
            page,
            sortBy,
            includeGenreIds,
            excludeGenreIds,
            minVotes: sortBy.includes("vote_average")
              ? effectiveMinVotes
              : undefined,
            originalLanguage,
            keywordQuery,
            certificationCountry,
            certificationLte,
          }),
        { maxPages, needed: 30 },
      );
      return raw;
    };

    const loadTrendingPaged = async (maxPages = 1) => {
      const raw = await collectEnoughPages(
        (page) => getTrendingTitles(mediaType, "week", page),
        { maxPages, needed: 40 },
      );
      return raw;
    };

    const applyShelfRules = (list) => {
      if (!hasShelf) return list;
      return filterByShelfRules(list, {
        includeGenreIds,
        excludeGenreIds,
        allowMixed,
        requireAllInclude,
      });
    };

    const fillIfTooSmall = async (current) => {
      if (!hasShelf) return current;
      if (current.length >= MAX_ITEMS) return current;

      const include = Array.isArray(includeGenreIds) ? includeGenreIds : [];
      const exclude = Array.isArray(excludeGenreIds) ? excludeGenreIds : [];

      const more = await loadDiscoverPaged("popularity.desc", 3);

      const looser = more.filter((item) => {
        const ids = Array.isArray(item?.genre_ids) ? item.genre_ids : [];
        if (exclude.length > 0 && ids.some((g) => exclude.includes(g)))
          return false;
        if (include.length > 0) {
          if (allowMixed) {
            if (!ids.some((g) => include.includes(g))) return false;
          } else {
            const primary = ids[0];
            const secondary = ids[1];
            if (primary == null && secondary == null) return false;
            if (!(include.includes(primary) || include.includes(secondary)))
              return false;
          }
        }
        return true;
      });

      return uniqueById([...current, ...looser]).slice(0, MAX_ITEMS);
    };

    const load = async () => {
      try {
        setHasError(false);
        setIsLoading(true);

        const results = await fetchRowWithCache(requestKey, async () => {
          const wantsPopular =
            mode === "mix" ? modes.includes("popular") : mode === "popular";
          const wantsTrending =
            mode === "mix" ? modes.includes("trending") : mode === "trending";
          const wantsTopRated =
            mode === "mix" ? modes.includes("top_rated") : mode === "top_rated";

          // Only request the buckets this row actually needs; unused ones resolve instantly.
          const [popularRaw, trendingRaw, topRatedRaw] = await Promise.all([
            wantsPopular
              ? loadDiscoverPaged("popularity.desc", 1)
              : Promise.resolve([]),
            wantsTrending ? loadTrendingPaged(1) : Promise.resolve([]),
            wantsTopRated
              ? loadDiscoverPaged("vote_average.desc", 1)
              : Promise.resolve([]),
          ]);

          const popular = uniqueById(applyShelfRules(popularRaw));
          const topRated = uniqueById(applyShelfRules(topRatedRaw));
          const trending = uniqueById(applyShelfRules(trendingRaw));

          let built = [];
          if (mode === "mix") {
            built = buildWeightedMix(
              { popular, trending, topRated },
              MAX_ITEMS,
            );
          } else if (mode === "trending") {
            built = trending.slice(0, MAX_ITEMS);
            if (built.length < 10)
              // backfill with popular if trending is sparse
              built = uniqueById([...built, ...popular]).slice(0, MAX_ITEMS);
          } else if (mode === "top_rated") {
            built = topRated.slice(0, MAX_ITEMS);
          } else {
            built = popular.slice(0, MAX_ITEMS);
          }

          built = await fillIfTooSmall(built);
          return built;
        });

        if (cancelled) return;
        setItems(results);
      } catch (err) {
        console.error("BrowseRow fetch error:", err?.response?.status, err);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  return { items, isLoading, hasError };
}
