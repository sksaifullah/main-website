"use client";

import React from "react";

export const PartnersSection: React.FC = () => {
  return (
    <section id="partners" className="section-padding bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-primary mb-3">
            <i className="fa-solid fa-handshake-angle"></i> Courier Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Global Courier Partners
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            Providing seamless worldwide logistics in partnership with the industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* DHL */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-dhl h-10 w-auto object-contain"
              viewBox="0 0 200 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="200" height="50" rx="6" fill="#FFCC00" />
              <path
                d="M20 12h24l-4 26H16l4-26zm30 0h22c7 0 11 3 10 7-1 4-5 7-11 7h-8l-2 12h-13l5-26zm10 5l-2 5h6c3 0 5-1 5-3 0-1-1-2-4-2h-5zm34-5h12l-3 18h16l-1 8h-27l3-26z"
                fill="#D40511"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">DHL Express</span>
          </div>

          {/* FedEx */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-fedex h-10 w-auto object-contain"
              viewBox="0 0 160 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="5"
                y="38"
                fontFamily="'Inter', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="40"
                fill="#4D148C"
                letterSpacing="-1"
              >
                Fed<tspan fill="#FF6600">Ex</tspan>
              </text>
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">FedEx Express</span>
          </div>

          {/* UPS */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-ups h-12 w-auto object-contain"
              viewBox="0 0 80 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M40 4L8 16v32c0 24 32 40 32 40s32-16 32-40V16L40 4z" fill="#FFB500" />
              <path d="M40 10L14 20v26c0 18 26 32 26 32s26-14 26-32V20L40 10z" fill="#351C15" />
              <path
                d="M26 30h8v16c0 4 3 7 7 7s7-3 7-7V30h8v16c0 9-6 14-15 14s-15-5-15-14V30z"
                fill="#FFB500"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">UPS Courier</span>
          </div>

          {/* Aramex */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-aramex h-10 w-auto object-contain"
              viewBox="0 0 160 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="5"
                y="36"
                fontFamily="'Inter', sans-serif"
                fontWeight="800"
                fontSize="34"
                fill="#E31837"
                letterSpacing="-1"
              >
                aramex
              </text>
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aramex</span>
          </div>

          {/* TNT */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-tnt h-10 w-auto object-contain"
              viewBox="0 0 140 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="140" height="44" rx="8" fill="#FF6600" />
              <text
                x="25"
                y="33"
                fontFamily="'Inter', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="28"
                fill="#FFFFFF"
                letterSpacing="2"
              >
                TNT
              </text>
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">TNT Cargo</span>
          </div>

          {/* DPD */}
          <div className="group partner-logo-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]">
            <svg
              className="partner-logo-img logo-dpd h-10 w-auto object-contain"
              viewBox="0 0 140 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="10"
                y="36"
                fontFamily="'Inter', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="36"
                fill="#DC0032"
                letterSpacing="-1"
              >
                dpd
              </text>
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">DPD Logistics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
