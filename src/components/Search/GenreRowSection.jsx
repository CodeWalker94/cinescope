import { useBrowseRowData } from "../../hooks/useBrowseRowData.js";
import SearchRow from "./SearchRow.jsx";

/**
 * Bridge: rowConfig (from DASHBOARD_ROWS / GENRE_ROWS) → useBrowseRowData → SearchRow
 * Keeps GenreDashboard and GenrePage free of fetch logic.
 */
const GenreRowSection = ({ rowConfig, onOpenDetails }) => {
  const { items, isLoading, hasError } = useBrowseRowData({
    title: rowConfig.id, // used as cache key, not displayed
    mediaType: rowConfig.mediaType,
    filter: rowConfig.filter ?? {},
    mode: rowConfig.mode ?? "mix",
    modes: rowConfig.modes ?? ["popular", "trending"],
    minVotes: rowConfig.minVotes,
  });

  return (
    <SearchRow
      title={rowConfig.title}
      items={items}
      isLoading={isLoading}
      hasError={hasError}
      onOpenDetails={onOpenDetails}
    />
  );
};

export default GenreRowSection;
