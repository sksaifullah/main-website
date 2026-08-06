"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface ServiceItem {
  icon: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  specs: string[];
}

const servicesData: ServiceItem[] = [
  {
    icon: "fa-bolt-lightning",
    badge: "3–5 DAYS",
    title: "International Express Courier",
    desc: "Door-to-door express parcel delivery to USA, UK, UAE, Canada, and 220+ countries.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    specs: ["Free Doorstep Pickup", "Real-Time Tracking", "Customs Clearance"],
  },
  {
    icon: "fa-[#005DC3]",
    badge: "SPECIAL CARE",
    title: "Prescription Medicine Shipping",
    desc: "Secure worldwide courier for essential medicines with doctor prescription compliance.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    specs: ["Temperature Control", "FDA & WHO Compliant", "Express Delivery"],
  },
  {
    icon: "fa-[#005DC3]",
    badge: "AIR CARGO",
    title: "Excess Baggage & Cargo",
    desc: "Cost-effective air freight solution for students, expats & personal household cargo.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
    specs: ["Door to Airport / Door", "Heavy Parcel Tariff", "Insurance Option"],
  },
  {
    icon: "fa-utensils",
    badge: "SEALED PACK",
    title: "Homemade Food & Sweets",
    desc: "Special vacuum-sealed air shipment for snacks, spices, sweets & homemade food items.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    specs: ["Vacuum Packaging", "Food Grade Approved", "Fast Express Transit"],
  },
  {
    icon: "fa-[#005DC3]",
    badge: "COMMERCIAL",
    title: "E-Commerce Air Freight",
    desc: "End-to-end international fulfillment for online sellers, exporters & SMEs.",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=600&q=80",
    specs: ["Bulk Volume Rates", "API Tracking Integration", "Priority Duty Support"],
  },
];

interface ServicesSectionProps {
  onOpenQuoteModal?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenQuoteModal,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getCardsPerPage = useCallback(() => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const perPage = getCardsPerPage();
      const pages = Math.max(1, Math.ceil(servicesData.length / perPage));
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

    const cards = trackRef.current.querySelectorAll(".service-card-item");
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
    const firstCard = track.querySelector(".service-card-item") as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 20; // 20px gap
    const scrollLeft = track.scrollLeft;
    const pageIndex = Math.round(scrollLeft / (cardWidth * perPage));
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, pageIndex)));
  };

  return (
    <section id="services-section" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header-row mb-10">
          <div>
            <div className="badge-pill mb-3">CORE SERVICES</div>
            <h2 className="section-title-lg text-slate-900 dark:text-white">
              Specialized Air Courier Solutions
            </h2>
          </div>
          <p className="section-desc max-w-xl text-slate-600 dark:text-slate-400">
            From urgent documents to prescription medicines, sweets, and heavy commercial freight — delivered worldwide with speed.
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="services-carousel-wrapper">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="services-carousel-track"
            aria-label="Services carousel"
          >
            {servicesData.map((item) => (
              <div
                key={item.title}
                className="carousel-card service-card-item p-0 overflow-hidden group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={300}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[#005DC3] text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/20 shadow-md">
                    {item.badge}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#005DC3] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                      {item.desc}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <i className="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onOpenQuoteModal}
                    className="w-full py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#005DC3] dark:text-blue-300 hover:bg-[#005DC3] hover:text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Get Instant Quote &amp; Book</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="services-carousel-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous service page"
              className="carousel-btn-prev disabled:opacity-30"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="carousel-dots-container">
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => goToPage(pageIdx)}
                  aria-label={`Go to service page ${pageIdx + 1}`}
                  className={`carousel-dot ${pageIdx === currentPage ? "active" : ""}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next service page"
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
