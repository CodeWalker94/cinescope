import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanToggle from "./PlanToggle";

const PRICES = {
  monthly: {
    label: "Monthly",
    savingsLabel: "",
    premium: "14.99",
    essential: "8.99",
    cta: "Try 1 week free",
  },
  annual: {
    label: "Annual",
    savingsLabel: "Save up to 20% with annual billing",
    premium: "149.99",
    essential: "89.99",
    cta: "Try 1 week free",
  },
};

const PLANS = {
  premium: { name: "Premium", tag: "Best for movie lovers & families" },
  essential: { name: "Essential", tag: "Great value starter plan" },
};

// Feature rows for the table
// true  = checkmark
// false = dash
// string = text
const FEATURE_ROWS = [
  { id: "adFree", label: "No ads", premium: true, essential: false },
  {
    id: "library",
    label: "Access to full CineScope library",
    premium: true,
    essential: true,
  },
  {
    id: "quality",
    label: "Streaming quality",
    premium: "Up to 4K* on supported devices",
    essential: "Up to HD*",
  },
  {
    id: "devices",
    label: "Streams at once",
    premium: "Up to 4 devices",
    essential: "Up to 2 devices",
  },
  {
    id: "downloads",
    label: "Download movies & shows",
    premium: true,
    essential: false,
  },
  {
    id: "profiles",
    label: "Profiles & watchlists",
    premium: true,
    essential: true,
  },
];

const renderFeatureCell = (value) => {
  if (value === true)
    return <span className="text-sm text-cine-highlight">✓</span>;
  if (value === false)
    return <span className="text-sm text-cine-muted/60">—</span>;
  return <span className="text-xs sm:text-sm text-cine-muted">{value}</span>;
};

const PickAPlan = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const navigate = useNavigate();

  // NEW: for Hulu-style mobile view (one plan at a time)
  const [selectedPlan, setSelectedPlan] = useState("premium"); // "premium" | "essential"

  const currentPricing = PRICES[billingPeriod];
  const { name: selectedPlanName, tag: selectedPlanTag } = PLANS[selectedPlan];
  const selectedPlanPrice = currentPricing[selectedPlan];

  const handleCta = () => {
    navigate("/plans");
  };

  return (
    <section
      id="plans"
      className="relative w-full bg-gradient-to-b from-[#05040A] via-[#070B16] to-[#0C1726] border-t border-white/5"
    >
      {/* Top overlay*/}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cine-muted mb-2">
            Plans & pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">
            Select the plan that fits{" "}
            <span className="text-gradient-cine">how you watch</span>
          </h2>
          <p className="text-sm sm:text-base text-cine-muted max-w-2xl mx-auto">
            No hidden fees or contracts. Switch plans or cancel anytime.
          </p>
        </div>

        {/* Toggle + savings text */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <PlanToggle
            value={billingPeriod}
            onChange={(nextBillingPeriod) =>
              setBillingPeriod(nextBillingPeriod)
            }
          />
          {currentPricing.savingsLabel && (
            <p className="text-xs sm:text-sm text-cine-highlight">
              {currentPricing.savingsLabel}
            </p>
          )}
        </div>

        {/* =========================
            MOBILE (Hulu-style)
           ========================= */}
        <div className="md:hidden">
          {/* Plan selector pill */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-[360px]">
              <label className="sr-only" htmlFor="planSelect">
                Select plan
              </label>

              <div className="relative">
                <select
                  id="planSelect"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="
                    w-full appearance-none
                    rounded-full
                    border border-white/15
                    bg-white/5
                    px-5 py-3
                    text-sm font-semibold text-white
                    backdrop-blur-md
                    shadow-[0_18px_60px_rgba(0,0,0,0.55)]
                    focus:outline-none focus:ring-2 focus:ring-cine-highlight/60
                  "
                >
                  <option value="premium">Premium</option>
                  <option value="essential">Essential</option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Selected plan header */}
          <div className="max-w-[520px] mx-auto border-y border-white/10 py-6 text-center">
            <p className="text-base font-semibold text-white">
              {selectedPlanName}
            </p>
            <p className="mt-1 text-xs text-cine-muted">{selectedPlanTag}</p>

            <div className="mt-3 flex items-baseline justify-center gap-2">
              <p className="text-3xl font-semibold text-white">
                <span className="align-top text-lg">$</span>
                {selectedPlanPrice}
              </p>
              <span className="text-xs text-cine-muted">
                /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
              </span>
            </div>
          </div>

          {/* Features (stacked) */}
          <div className="max-w-[520px] mx-auto divide-y divide-white/10">
            {FEATURE_ROWS.map((row) => {
              const value =
                selectedPlan === "premium" ? row.premium : row.essential;

              return (
                <div key={row.id} className="py-5">
                  <p className="text-sm text-white mb-2">{row.label}</p>
                  <div className="flex justify-center">
                    {renderFeatureCell(value)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="max-w-[520px] mx-auto pt-8">
            <button
              type="button"
              onClick={handleCta}
              className="
                w-full rounded-xl
                bg-cine-highlight/70
                px-4 py-3
                text-sm font-semibold text-cine-bg
                transition-colors
                hover:bg-cine-highlight/60
              "
            >
              {currentPricing.cta}
            </button>

            <p className="mt-3 text-[11px] text-cine-muted/80 text-center">
              Free trial available for new members only. Cancel anytime before
              your billing date.
            </p>
          </div>
        </div>

        {/* =========================
            DESKTOP (your table)
           ========================= */}
        <div className="hidden md:block overflow-x-auto">
          {/* No card bg; only horizontal lines between rows */}
          <div className="min-w-[720px] divide-y divide-white/10 bg-transparent">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-transparent py-5">
              {/* Empty top-left cell (no label) */}
              <div className="px-4 sm:px-6" />

              {/* Premium header */}
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Premium
                  </p>
                  <p className="text-xs text-cine-muted">
                    Best for movie lovers & families
                  </p>
                  <div className="mt-2 flex items-baseline justify-center gap-1.5">
                    <p className="text-xl sm:text-2xl font-semibold text-white">
                      <span className="align-top text-sm">$</span>
                      {currentPricing.premium}
                    </p>
                    <span className="text-[11px] sm:text-xs text-cine-muted">
                      /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
                    </span>
                  </div>
                </div>
              </div>

              {/* Essential header */}
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Essential
                  </p>
                  <p className="text-xs text-cine-muted">
                    Great value starter plan
                  </p>
                  <div className="mt-2 flex items-baseline justify-center gap-1.5">
                    <p className="text-xl sm:text-2xl font-semibold text-white">
                      <span className="align-top text-sm">$</span>
                      {currentPricing.essential}
                    </p>
                    <span className="text-[11px] sm:text-xs text-cine-muted">
                      /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {FEATURE_ROWS.map((row) => (
              <div key={row.id} className="grid grid-cols-3 bg-transparent">
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center">
                  <p className="text-xs sm:text-sm text-white">{row.label}</p>
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center">
                  {renderFeatureCell(row.premium)}
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center">
                  {renderFeatureCell(row.essential)}
                </div>
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-3 bg-transparent py-5">
              <div className="px-4 sm:px-6 flex items-center">
                <p className="text-[11px] sm:text-xs text-cine-muted/80">
                  Free trial available for new members only. Cancel anytime
                  before your billing date.
                </p>
              </div>

              <div className="px-4 sm:px-6 flex items-center">
                <button
                  type="button"
                  className="w-full rounded-md bg-cine-highlight/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-cine-bg transition-colors hover:bg-cine-highlight/60"
                  onClick={handleCta}
                >
                  {currentPricing.cta}
                </button>
              </div>

              <div className="px-4 sm:px-6 flex items-center">
                <button
                  type="button"
                  className="w-full rounded-md bg-cine-highlight/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-cine-bg transition-colors hover:bg-cine-highlight/60"
                  onClick={handleCta}
                >
                  {currentPricing.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into the Browse section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#050711]" />
    </section>
  );
};

export default PickAPlan;
