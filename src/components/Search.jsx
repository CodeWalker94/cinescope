const Search = ({ searchTerm, setSearchTerm, onSubmit }) => {
  return (
    <div className="search">
      <div>
        {/* Magnifying Glass Icon */}
        <img
          src={`${import.meta.env.BASE_URL}icons/search.svg`}
          alt="Search"
          className="pointer-events-none"
        />

        <input
          type="text"
          placeholder="Browse movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typeof onSubmit === "function")
              onSubmit(searchTerm);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
