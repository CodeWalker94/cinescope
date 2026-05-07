import { useState } from "react";
import PlanToggle from "./PlanToggle";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";

const PLANS = [
  {
    id: "premium",
    name: "CineScope Premium",
    tag: "Best for movie lovers & families",
    highlight: "Ad-free, 4K* & up to 4 screens",
    features: [
      "Ad-free streaming on most titles",
      "Access all movies & series",
      "Stream on up to 4 devices at once",
      "Download movies & shows to watch offline",
      "Early access to select premieres",
    ],
  },
  {
    id: "essential",
    name: "CineScope Essential",
    tag: "Great value starter plan",
    highlight: "Ads on some titles, HD streaming",
    features: [
      "HD streaming on supported devices",
      "Full movie & series library",
      "Stream on up to 2 devices at once",
      "Personalized watchlist & profiles",
    ],
  },
];

const PRICES = {
  monthly: {
    label: "Monthly",
    savingsLabel: "",
    premium: "14.99",
    essential: "8.99",
    cta: "Start monthly plan",
  },
  annual: {
    label: "Annual",
    savingsLabel: "Save up to 20% with annual billing",
    premium: "149.99",
    essential: "89.99",
    cta: "Start annual plan",
  },
};

const PlanPage = () => {
  // "monthly" or "annual"
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  // Get the pricing info for the selected billing period
  const currentPricing = PRICES[billingPeriod];

  const ctaClassName =
    "w-full rounded-xl border border-white/15 bg-cine-highlight/70 px-4 py-3 text-sm sm:text-[15px] font-semibold text-cine-bg transition-colors duration-200 hover:bg-cine-highlight/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60";

  return (
    <main className="relative min-h-screen bg-cine-bg">
      <Header className="absolute top-0 left-0 w-full z-40" />

      <section className="relative w-full bg-gradient-to-b from-[#05040A] via-[#070B16] to-[#0C1726] pt-16">
        {/* Soft top overlay so it blends with the header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-cine-bg/80 to-transparent" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-cine-muted mb-2">
              Choose your experience
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">
              Pick a plan that fits&nbsp;
              <span className="text-gradient-cine">how you watch</span>
            </h2>
            <p className="text-sm sm:text-base text-cine-muted max-w-2xl mx-auto">
              Switch between monthly or annual billing anytime. No contracts, no
              hassle — just movies.
            </p>
          </div>

          {/* Toggle + savings label */}
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

          {/* Plans grid */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {PLANS.map((plan) => {
              // Decide which price to show for this plan
              const planPrice =
                plan.id === "premium"
                  ? currentPricing.premium
                  : currentPricing.essential;

              return (
                <article
                  key={plan.id}
                  className="group relative rounded-2xl bg-white/5 backdrop-blur-md px-6 py-7 sm:px-8 sm:py-9 flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.65)] transition-colors duration-300 hover:bg-white/10"
                >
                  {/* Glow border (Browse TitleCard-style) */}
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 ring-inset ring-4 ring-cine-highlight/80 group-hover:opacity-100 group-focus-within:opacity-100" />

                  {/* Glow line at top */}
                  <div className="pointer-events-none absolute inset-x-3 sm:inset-x-5 top-0 z-20 h-px bg-gradient-to-r from-cine-highlight/0 via-cine-highlight/70 to-cine-highlight/0 opacity-90" />

                  <header className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white">
                        {plan.name}
                      </h3>
                      {plan.id === "premium" && (
                        <span className="inline-flex items-center rounded-full bg-cine-highlight/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cine-highlight">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-cine-muted">
                      {plan.tag}
                    </p>
                  </header>

                  {/* Price + highlight */}
                  <div className="mb-6 flex items-baseline gap-2 sm:gap-3">
                    <p className="text-3xl sm:text-4xl font-semibold text-white">
                      <span className="align-top text-lg">$</span>
                      {planPrice}
                    </p>
                    <span className="text-xs sm:text-sm text-cine-muted">
                      /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
                    </span>
                  </div>

                  <p className="mb-6 text-sm sm:text-base text-cine-muted">
                    {plan.highlight}
                  </p>

                  {/* Features */}
                  <ul className="mb-7 space-y-3 text-sm sm:text-[15px] text-cine-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-cine-highlight/15">
                          <span className="h-2 w-2 rounded-full bg-cine-highlight" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button type="button" className={ctaClassName}>
                      {currentPricing.cta}
                    </button>

                    <p className="mt-3 text-[11px] text-cine-muted/80">
                      Free trial available for new members only. Cancel anytime
                      before your billing date.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom fade into cine bg */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#050711]" />
      </section>
      <Footer />
    </main>
  );
};

export default PlanPage;
