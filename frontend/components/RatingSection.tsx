"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Sky Worldwide delivered my urgent pharmaceutical medicine package to London in just 3 days! Customs clearance was seamless.",
  },
  {
    name: "Sarah Jenkins",
    location: "Chicago, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Best courier service for excess baggage and homemade foods to the USA. Packaging was intact and tracking was 100% accurate.",
  },
  {
    name: "Ahmed Al-Maktoum",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Super fast express air cargo delivery from Mumbai to Dubai within 36 hours. Professional staff and great customer service.",
  },
  {
    name: "Priya Patel",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Sent Diwali sweets and clothes to my family in Sydney. Reached on time without any hassle or extra customs fees.",
  },
];

export const RatingSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getCardsPerPage = useCallback(() => {
    if (typeof window === "undefined") return 2;
    const w = window.innerWidth;
    if (w >= 768) return 2;
    return 1;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const perPage = getCardsPerPage();
      const pages = Math.max(1, Math.ceil(testimonials.length / perPage));
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

    const cards = trackRef.current.querySelectorAll(".testimonial-card-item");
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
    const firstCard = track.querySelector(".testimonial-card-item") as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 20; // 20px gap
    const scrollLeft = track.scrollLeft;
    const pageIndex = Math.round(scrollLeft / (cardWidth * perPage));
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, pageIndex)));
  };

  return (
    <section id="ratings-section" className="py-20 bg-slate-100 dark:bg-slate-900/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Header Summary Box */}
        <div className="bg-gradient-to-r from-slate-900 via-[#00398A] to-[#005DC3] rounded-3xl p-8 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-white/20 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-5xl font-extrabold tracking-tight">4.9</span>
                <div>
                  <div className="flex text-amber-400 text-sm">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star-half-stroke"></i>
                  </div>
                  <span className="text-xs text-blue-200 font-medium">Over 2,500+ Verified Reviews</span>
                </div>
              </div>
              <p className="text-xs text-blue-100 font-semibold">Rated Excellent on Google &amp; Trustpilot</p>
            </div>

            <div className="md:col-span-8 space-y-2">
              <h3 className="text-xl font-extrabold">What Shippers Say About Sky Worldwide</h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                We take pride in safely transporting urgent medication, food products, documentations, and personal cargo across the globe with transparent pricing and zero surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel Section */}
        <div className="section-header-row mb-8">
          <div>
            <div className="badge-pill mb-2">CUSTOMER STORIES</div>
            <h3 className="section-title-lg text-slate-900 dark:text-white">Real Experiences</h3>
          </div>
        </div>

        <div className="testimonials-carousel-wrapper">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="testimonials-carousel-track"
            aria-label="Testimonials carousel"
          >
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="carousel-card testimonial-card-item p-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#005DC3]"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-400 text-xs mb-3">
                    {Array.from({ length: item.rating }).map((_, rIdx) => (
                      <i key={rIdx} className="fa-solid fa-star"></i>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span><i className="fa-solid fa-[#005DC3] mr-1"></i> Verified Shipment</span>
                  <span className="text-slate-400 font-normal">Delivered via Air Express</span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="testimonials-carousel-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous testimonial page"
              className="carousel-btn-prev disabled:opacity-30"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="carousel-dots-container">
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => goToPage(pageIdx)}
                  aria-label={`Go to testimonial page ${pageIdx + 1}`}
                  className={`carousel-dot ${pageIdx === currentPage ? "active" : ""}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next testimonial page"
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
