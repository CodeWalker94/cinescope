const OPTIONS = [
  { id: "monthly", label: "Monthly", sub: "Pay month to month" },
  { id: "annual", label: "Annual", sub: "Best value" },
];

const PlanToggle = ({ value, onChange }) => {
  const isAnnual = value === "annual";

  return (
    <div className="relative inline-flex items-center">
      {/* Outer pill */}
      <div className="relative flex w-64 max-w-full items-center rounded-full border-3 border-white bg-white/5 p-1 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        {/* Sliding highlight */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-cine-highlight/70 transition-transform duration-300 ease-out
            ${isAnnual ? "translate-x-full" : "translate-x-0"}
          `}
        />

        {/* Options */}
        {OPTIONS.map((option, i) => {
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`relative z-10 flex-1 py-3.5 ${i === 0 ? "px-2.5 text-left" : "px-2 text-right"}`}
            >
              <span
                className={`block text-l font-semibold uppercase tracking-[0.16em] transition-colors
                  ${isActive ? "text-white" : "text-cine-muted/70"}
                `}
              >
                {option.label}
              </span>
              <span
                className={`mt-0.5 block text-[11px] transition-colors
                  ${isActive ? "text-white" : "text-cine-muted/60"}
                `}
              >
                {option.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlanToggle;
