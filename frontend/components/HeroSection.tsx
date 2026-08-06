"use client";

import React, { useState } from "react";
import Image from "next/image";

interface HeroSectionProps {
  onOpenQuoteModal: () => void;
  onTrackSearch: (trackingNumber: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenQuoteModal,
  onTrackSearch,
}) => {
  const [trackingNum, setTrackingNum] = useState("");

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNum.trim()) {
      onTrackSearch(trackingNum.trim());
    }
  };

  return (
    <section id="home" className="hero-section min-h-[85vh] flex items-center py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="badge-primary bg-blue-900/60 text-blue-200 border-blue-400/30 backdrop-blur-md">
              <i className="fa-solid fa-shield-halved"></i> IATA & Customs Accredited Courier
            </div>

            <h1
              id="hero-title-display"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
            >
              World-Class Express <span className="text-blue-400">Courier & Air Freight</span> Delivery.
            </h1>

            <p
              id="hero-subtitle-display"
              className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed"
            >
              Reliable door-to-door international express courier for parcels, prescription medicines, food, documents, and commercial excess baggage to USA, UK, UAE, Australia, and 220+ countries.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenQuoteModal}
                className="btn-primary py-3.5 px-6 text-sm shadow-lg cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane"></i> Book Shipment
              </button>
              <button
                onClick={onOpenQuoteModal}
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm py-3.5 px-6 text-sm cursor-pointer"
              >
                <i className="fa-solid fa-calculator"></i> Get a Quote
              </button>
            </div>

            {/* Integrated Quick Track Input Box */}
            <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl">
              <form id="hero-tracking-form" onSubmit={handleTrackingSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <i className="fa-solid fa-barcode absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                  <input
                    type="text"
                    id="hero-tracking-input"
                    value={trackingNum}
                    onChange={(e) => setTrackingNum(e.target.value)}
                    placeholder="Enter Partner Tracking No (e.g. 7940561073, JD0146001234567890)"
                    className="form-input pl-12 py-3.5 text-sm font-semibold border-none bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary py-3.5 px-6 text-sm whitespace-nowrap cursor-pointer">
                  <i className="fa-solid fa-magnifying-glass"></i> Track Now
                </button>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-blue-400"></i> Doorstep Pickup
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-blue-400"></i> Customs Guaranteed
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-blue-400"></i> Live GPS Tracking
              </span>
            </div>
          </div>

          {/* Right Hero Visual Photo Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="International Air Cargo Freighter Aircraft"
                width={1200}
                height={600}
                unoptimized
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

              {/* Overlay Live Shipment Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#005DC3] text-white flex items-center justify-center font-bold">
                      <i className="fa-solid fa-plane-up"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        SKY-9984567 (Express Air)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Mumbai → London Heathrow
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-950 text-[#005DC3] dark:text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    In Transit
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#005DC3] h-full w-[70%] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats Strip */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#005DC3] tracking-tight">
                100,000+
              </span>
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                Parcels Delivered
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-slate-800">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#005DC3] tracking-tight">
                220+
              </span>
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                Countries Served
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:border-l">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#005DC3] tracking-tight">
                99.4%
              </span>
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                On-Time Delivery
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#005DC3] tracking-tight">
                24/7
              </span>
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                Customer Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
