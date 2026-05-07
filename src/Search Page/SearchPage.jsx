import { useState } from "react";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { useSearchResults } from "../hooks/useSearchResults";
import PageLayout from "../components/Utility Components/PageLayout.jsx";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import SearchRow from "../components/Search/SearchRow.jsx";
import GenreDashboard from "../components/Search/GenreDashboard.jsx";
import GenrePage from "../components/Search/GenrePage.jsx";
import Modal from "../components/Modal/Modal.jsx";

const SearchPage = () => {
  const { query, genreId, mediaType, isAnime } = useSearchQuery();
  const { multiResults, movieResults, tvResults, isLoading, hasError } =
    useSearchResults(query);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState(null);

  const openTitleModal = ({ item, mediaType: mType }) => {
    if (!item?.id) return;
    const inferredType =
      mType || item.media_type || (item.first_air_date ? "tv" : "movie");
    setModalSelection({ ...item, mediaType: inferredType, id: item.id });
    setModalOpen(true);
  };

  const hasQuery = query.trim().length >= 2;
  const isGenreOnly = !hasQuery && !!genreId;

  return (
    <PageLayout>
      <Header className="sticky top-0 left-0 w-full z-40 bg-cine-bg/80 backdrop-blur" />

      {hasQuery ? (
        <div className="max-w-7xl mx-auto px-4 pb-16 space-y-6">
          <SearchRow
            title="Top Results"
            items={multiResults}
            isLoading={isLoading}
            hasError={hasError}
            onOpenDetails={openTitleModal}
          />
          <SearchRow
            title="Movies"
            items={movieResults}
            isLoading={isLoading}
            hasError={hasError}
            onOpenDetails={openTitleModal}
          />
          <SearchRow
            title="TV Shows"
            items={tvResults}
            isLoading={isLoading}
            hasError={hasError}
            onOpenDetails={openTitleModal}
          />
        </div>
      ) : isGenreOnly ? (
        <GenrePage
          genreId={genreId}
          mediaType={mediaType}
          isAnime={isAnime}
          onOpenDetails={openTitleModal}
        />
      ) : (
        <GenreDashboard onOpenDetails={openTitleModal} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selection={modalSelection}
      />
      <Footer />
    </PageLayout>
  );
};

export default SearchPage;
