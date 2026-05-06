import { getTitle } from "../../utils/titleHelpers";

const TopRowCard = ({ movie, isActive, onClick, index }) => {
  const title = getTitle(movie);

  return (
    <button
      type="button"
      id={`card-${index}`}
      className={`carousel-card ${isActive ? "active" : "inactive"}`}
      onClick={onClick}
      aria-label={title}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={title}
      />
    </button>
  );
};

export default TopRowCard;
