"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface CountryItem {
  name: string;
  flagUrl: string;
  delivery: string;
  cities: string[];
}

const defaultCountries: CountryItem[] = [
  {
    name: "United States",
    flagUrl: "https://flagcdn.com/w80/us.png",
    delivery: "3–5 business days",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Dallas"],
  },
  {
    name: "United Kingdom",
    flagUrl: "https://flagcdn.com/w80/gb.png",
    delivery: "2–4 business days",
    cities: ["London", "Manchester", "Birmingham", "Glasgow", "Edinburgh"],
  },
  {
    name: "Canada",
    flagUrl: "https://flagcdn.com/w80/ca.png",
    delivery: "3–5 business days",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  },
  {
    name: "Australia",
    flagUrl: "https://flagcdn.com/w80/au.png",
    delivery: "4–6 business days",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },
  {
    name: "United Arab Emirates",
    flagUrl: "https://flagcdn.com/w80/ae.png",
    delivery: "2–3 business days",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  },
  {
    name: "Saudi Arabia",
    flagUrl: "https://flagcdn.com/w80/sa.png",
    delivery: "3–5 business days",
    cities: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
  },
  {
    name: "Germany",
    flagUrl: "https://flagcdn.com/w80/de.png",
    delivery: "3–5 business days",
    cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne"],
  },
  {
    name: "Singapore",
    flagUrl: "https://flagcdn.com/w80/sg.png",
    delivery: "2–3 business days",
    cities: ["Singapore City", "Jurong", "Woodlands", "Tampines"],
  },
];

interface CountriesSectionProps {
  onOpenQuoteModal?: () => void;
}

export const CountriesSection: React.FC<CountriesSectionProps> = ({
  onOpenQuoteModal,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [countries] = useState<CountryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin_countries");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((c: Record<string, unknown>) => ({
              name: String(c.name || "Country"),
              flagUrl: String(c.flagUrl || c.flag || "https://flagcdn.com/w80/un.png"),
              delivery: String(c.delivery || "3–7 business days"),
              cities: typeof c.cities === "string" ? c.cities.split(",").map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(c.cities) ? c.cities.map(String) : []),
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load dynamic admin countries:", e);
      }
    }
    return defaultCountries;
  });

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
      const pages = Math.max(1, Math.ceil(countries.length / perPage));
      setTotalPages(pages);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [countries.length, getCardsPerPage]);

  const goToPage = (pageIndex: number) => {
    if (!trackRef.current) return;
    const perPage = getCardsPerPage();
    const newPage = Math.max(0, Math.min(totalPages - 1, pageIndex));
    setCurrentPage(newPage);

    const cards = trackRef.current.querySelectorAll(".country-card-new");
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
    const firstCard = track.querySelector(".country-card-new") as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 20; // 20px gap
    const scrollLeft = track.scrollLeft;
    const pageIndex = Math.round(scrollLeft / (cardWidth * perPage));
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, pageIndex)));
  };

  return (
    <section id="countries-section" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header-row mb-10">
          <div>
            <div className="badge-pill mb-3">GLOBAL COVERAGE</div>
            <h2 className="section-title-lg text-slate-900 dark:text-white">
              Countries We Deliver To
            </h2>
          </div>
          <p className="section-desc max-w-xl text-slate-600 dark:text-slate-400">
            Express door-to-door courier services to over 220+ countries worldwide with real-time tracking and customs support.
          </p>
          <button
            onClick={onOpenQuoteModal}
            className="text-xs font-bold text-[#005DC3] hover:underline cursor-pointer"
          >
            Explore all &rarr;
          </button>
        </div>

        {/* Carousel wrapper */}
        <div className="countries-carousel-wrapper">
          <div
            id="countries-grid"
            ref={trackRef}
            onScroll={handleScroll}
            className="countries-carousel-track"
            aria-label="Countries carousel"
          >
            {countries.map((c, idx) => (
              <div key={`${c.name}-${idx}`} className="country-card-new flex flex-col justify-between">
                <div>
                  <div className="country-card-flag-row">
                    <Image
                      src={c.flagUrl}
                      alt={`${c.name} flag`}
                      width={48}
                      height={32}
                      unoptimized
                      className="country-flag-img object-contain"
                    />
                    <div className="est-delivery-block">
                      <span className="est-delivery-label">EST. DELIVERY</span>
                      <span className="est-delivery-time">{c.delivery}</span>
                    </div>
                  </div>
                  <h3 className="country-card-name text-slate-900 dark:text-white">{c.name}</h3>
                  <div className="city-pills-row">
                    {c.cities.map((city, cIdx) => (
                      <span key={`${city}-${cIdx}`} className="city-pill-tag">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-[9px]"></i> Doorstep Pickup Active
                  </span>
                  <button
                    onClick={onOpenQuoteModal}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#005DC3] dark:text-blue-300 hover:bg-[#005DC3] hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    Ship Now &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="countries-carousel-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous countries page"
              className="carousel-btn-prev disabled:opacity-30"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="carousel-dots-container">
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => goToPage(pageIdx)}
                  aria-label={`Go to countries page ${pageIdx + 1}`}
                  className={`carousel-dot ${pageIdx === currentPage ? "active" : ""}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next countries page"
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
