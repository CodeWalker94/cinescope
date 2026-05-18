const KEY = "cinescope:watchlist";

const getList = () => {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || "[]");
    // migrate items saved with old posterPath key before the fix
    return items.map((item) => ({
      ...item,
      poster_path: item.poster_path ?? item.posterPath ?? null,
    }));
  } catch {
    return [];
  }
};

const writeList = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("watchlist-change"));
};

export const getWatchlist = () => getList();

export const addToWatchlist = (item) => {
  const current = getList();
  if (current.some((w) => w.id === item.id && w.mediaType === item.mediaType)) return;
  writeList([item, ...current]);
};

export const removeFromWatchlist = (id, mediaType) => {
  writeList(getList().filter((w) => !(w.id === id && w.mediaType === mediaType)));
};

export const isInWatchlist = (id, mediaType) =>
  getList().some((w) => w.id === id && w.mediaType === mediaType);
