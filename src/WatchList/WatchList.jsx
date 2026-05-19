import { useState, useEffect } from "react";
import PageLayout from "../components/Utility Components/PageLayout.jsx";
import Header from "../components/Header/Header.jsx";
import TitleCard from "../components/Browse Categories/TitleCard";
import Footer from "../components/Footer/Footer.jsx";
import Modal from "../components/Modal/Modal.jsx";
import { getWatchlist } from "../utils/watchlistStorage";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState(() => getWatchlist());
  const [openMenuItemId, setOpenMenuItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState(null);

  // keep the list in sync when items are added/removed from anywhere in the app
  useEffect(() => {
    const sync = () => setWatchlist(getWatchlist());
    window.addEventListener("watchlist-change", sync);
    return () => window.removeEventListener("watchlist-change", sync);
  }, []);

  const openTitleModal = ({ item, mediaType }) => {
    if (!item?.id) return;
    setModalSelection({ ...item, mediaType, id: item.id });
    setModalOpen(true);
  };

  return (
    <PageLayout>
      <Header className="sticky top-0 left-0 w-full z-40 bg-cine-bg/80 backdrop-blur" />

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-white text-2xl font-semibold mt-8 mb-6">Your Watchlist</h2>

        {watchlist.length === 0 ? (
          <p className="text-white/50 text-sm mt-16 text-center">
            No titles saved yet. Hit the + on any card or in a title's details to add it here.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {watchlist.map((item) => (
              <TitleCard
                key={`${item.mediaType}:${item.id}`}
                item={item}
                mediaType={item.mediaType}
                onOpenDetails={openTitleModal}
                isMenuOpen={openMenuItemId === item.id}
                isActive={activeItemId === item.id}
                onActivate={() => setActiveItemId(item.id)}
                onToggleMenu={() =>
                  setOpenMenuItemId((prev) => {
                    const next = prev === item.id ? null : item.id;
                    setActiveItemId(item.id);
                    return next;
                  })
                }
                onCloseMenu={() => setOpenMenuItemId(null)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} selection={modalSelection} />
      <Footer />
    </PageLayout>
  );
};

export default WatchList;
