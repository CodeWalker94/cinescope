const Directory = ({ layout = "horizontal" }) => {
  const baseClasses =
    "text-lg content-center font-medium text-[clamp(0.875rem,2vw,1rem)]";

  const layoutClasses =
    layout === "horizontal"
      ? "flex items-center gap-8"
      : "flex flex-col items-start gap-3";

  return (
    <div>
      <ul className={`${layoutClasses} ${baseClasses}`}>
        <li>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Movies
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => e.preventDefault()}>
            TV Shows
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Animated
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Directory;
