import { useState } from "react";
import FAQItem from "./FAQItem";

const FAQS = [
  {
    id: "what",
    question: "What is CineScope?",
    answer:
      "CineScope is your movie and TV discovery hub. Browse what is trending, open any title for the essentials, and build collections so you always have something ready when it is time to watch.",
  },
  {
    id: "watch",
    question: "Can I watch movies and shows on CineScope?",
    answer:
      "CineScope does not stream titles directly. We help you decide what is worth your time with fast details like synopsis, cast, and community score, then you can watch on your preferred service.",
  },
  {
    id: "collections",
    question: "What are Collections and how do they work?",
    answer:
      "Collections are your personal shelves. Group titles by mood, theme, or anything you want, like Sunday comfort movies, date night picks, or sci fi deep cuts. Add titles from the card menu and keep your favorites organized.",
  },
  {
    id: "missing",
    question: "Why is a title missing, or why is the info incomplete?",
    answer:
      "Sometimes a title may not be available yet, has limited metadata, or is listed differently depending on region and source data. If a poster, synopsis, or cast looks incomplete, it usually means the source has not published it yet.",
  },
  {
    id: "privacy",
    question: "Does CineScope track me?",
    answer:
      "CineScope is built to keep your privacy a priority in mind. Your likes, dislikes, and saved items are used to improve your experience, not to sell your information. You control what you save and what you keep.",
  },
  {
    id: "feedback",
    question: "How can I request a feature or report a bug?",
    answer:
      "If something feels off, tell us what happened. Screenshots help, but a quick description works too. We build CineScope in iterations, so feedback directly shapes what gets improved next.",
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-cine-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cine-muted mb-2">
            Help Center
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">
            Questions? <span className="text-gradient-cine">Answers.</span>
          </h2>
          <p className="text-sm sm:text-base text-cine-muted max-w-2xl mx-auto">
            Quick help for browsing, saving titles, and getting the most out of
            CineScope.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {FAQS.map((item) => (
            <FAQItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
