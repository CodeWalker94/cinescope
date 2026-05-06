import { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";
import PageLayout from "./components/Utility Components/PageLayout.jsx";

import TopRow from "./components/Hero/TopRow.jsx";
import Hero from "./components/Hero/Hero.jsx";
import HeroInfo from "./components/Hero/HeroInfo";

import ExploreSection from "./components/Mosaic/ExploreSection.jsx";
import PickAPlan from "./components/Pick A Plan/PickAPlan.jsx";
import BrowseSection from "./components/Browse Categories/BrowseSection.jsx";
import FAQSection from "./components/FAQ/FAQSection.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { getTrendingTitles } from "./API/tmdb";
import Modal from "./components/Modal/Modal.jsx";
import ScrollReveal from "./components/Utility Components/ScrollReveal.jsx";

const App = () => {
  const [trending, setTrending] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState(null); // { id, mediaType, ...optional fields }

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const data = await getTrendingTitles();
        setTrending(data);
        setHeroMovie(data[0]); // set first hero bg immediately
      } catch (err) {
        console.error("Error loading trending", err);
      }
    };
    loadTrendingMovies();
  }, []);

  const openTitleModal = ({ item, mediaType }) => {
    if (!item?.id) return;

    const inferredMediaType =
      mediaType || item.media_type || (item.first_air_date ? "tv" : "movie");

    setModalSelection({ ...item, mediaType: inferredMediaType, id: item.id });
    setModalOpen(true);
  };

  const closeTitleModal = () => {
    setModalOpen(false);
  };

  return (
    <PageLayout>
      <Header className="absolute top-0 left-0 w-full z-40" />

      <Hero movie={heroMovie}>
        <HeroInfo movie={heroMovie} onOpenDetails={openTitleModal} />
      </Hero>

      <section className="mt-10 sm:mt-3 md:mt-3 lg:mt-7">
        <TopRow trending={trending} onChangeHero={setHeroMovie} />
      </section>

      <ScrollReveal>
        <ExploreSection />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <PickAPlan />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <BrowseSection onOpenDetails={openTitleModal} />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <FAQSection />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <Footer />
      </ScrollReveal>

      <Modal
        isOpen={modalOpen}
        onClose={closeTitleModal}
        selection={modalSelection}
      />
    </PageLayout>
  );
};

export default App;
