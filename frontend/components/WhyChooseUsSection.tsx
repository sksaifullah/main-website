"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

export interface WhyPoint {
  icon: string;
  badge: string;
  title: string;
  desc: string;
}

const whyPoints: WhyPoint[] = [
  {
    icon: "fa-[#005DC3]",
    badge: "FASTEST TRANSIT",
    title: "Express Air Delivery",
    desc: "Direct air freight connections with 48-72 hr delivery to USA, UK, UAE & Europe.",
  },
  {
    icon: "fa-shield-halved",
    badge: "100% SECURE",
    title: "Tamper-Evident Packaging",
    desc: "Military-grade seals, moisture protection, and active GPS-monitored air cargo containers.",
  },
  {
    icon: "fa-scale-balanced",
    badge: "EXPERT CLEARANCE",
    title: "Customs & Duty Support",
    desc: "In-house licensed customs brokers handling invoice clearance, HS codes & VAT documentation.",
  },
  {
    icon: "fa-headset",
    badge: "ALWAYS ON",
    title: "24/7 Priority Support",
    desc: "Dedicated logistics account manager assigned for live phone, WhatsApp & email assistance.",
  },
  {
    icon: "fa-[#005DC3]",
    badge: "COMPLIANT",
    title: "Pharma & Special Cargo",
    desc: "Specialized cold-chain 2-8°C shipping for medicine, food items & sensitive electronics.",
  },
  {
    icon: "fa-[#005DC3]",
    badge: "TRANSPARENT",
    title: "No Hidden Surcharges",
    desc: "Clear upfront pricing with fuel surcharges included. No surprise customs tariffs.",
  },
];

interface WhyChooseUsSectionProps {
  onOpenQuoteModal?: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getCardsPerPage = useCallback(() => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    if (w >= 500) return 2;
    return 1;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const perPage = getCardsPerPage();
      const pages = Math.max(1, Math.ceil(whyPoints.length / perPage));
      setTotalPages(pages);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getCardsPerPage]);

  const goToPage = (pageIndex: number) => {
    if (!trackRef.current) return;
    const perPage = getCardsPerPage();
    const newPage = Math.max(0, Math.min(totalPages - 1, pageIndex));
    setCurrentPage(newPage);

    const cards = trackRef.current.querySelectorAll(".why-card-item");
    const targetIdx = newPage * perPage;
    if (cards[targetIdx]) {
      const cardLeft = (cards[targetIdx] as HTMLElement).offsetLeft;
      trackRef.current.scrollTo({ left: cardLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const perPage = getCardsPerPage();
    const firstCard = track.querySelector(".why-card-item") as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 20; // 20px gap
    const scrollLeft = track.scrollLeft;
    const pageIndex = Math.round(scrollLeft / (cardWidth * perPage));
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, pageIndex)));
  };

  return (
    <section id="why-us-section" className="py-20 bg-slate-100 dark:bg-slate-900/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header-row mb-10">
          <div>
            <div className="badge-pill mb-3">WHY SKY WORLDWIDE</div>
            <h2 className="section-title-lg text-slate-900 dark:text-white">
              Built for Speed, Security &amp; Complete Reliability
            </h2>
          </div>
          <p className="section-desc max-w-xl text-slate-600 dark:text-slate-400">
            Over 15+ years of international air logistics excellence, trusted by 10,000+ corporate clients and individual shippers globally.
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="why-carousel-wrapper">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="why-carousel-track"
            aria-label="Why choose us carousel"
          >
            {whyPoints.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="why-card-item group">
                <div className="why-card-inner bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl h-full flex flex-col justify-between shadow-sm group-hover:border-[#005DC3] transition">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#005DC3] dark:text-blue-400 flex items-center justify-center text-xl shadow-inner">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-extrabold tracking-widest text-[#005DC3] bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#005DC3] transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Guaranteed Service</span>
                    <i className="fa-solid fa-arrow-right text-xs text-slate-300 dark:text-slate-600 group-hover:text-[#005DC3] group-hover:translate-x-1 transition"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="why-carousel-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous why choose us page"
              className="carousel-btn-prev disabled:opacity-30"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="carousel-dots-container">
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => goToPage(pageIdx)}
                  aria-label={`Go to why choose us page ${pageIdx + 1}`}
                  className={`carousel-dot ${pageIdx === currentPage ? "active" : ""}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next why choose us page"
              className="carousel-btn-next disabled:opacity-30"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
