"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005DC3] text-white flex items-center justify-center font-bold text-lg">
                <i className="fa-solid fa-plane"></i>
              </div>
              <span className="text-xl font-extrabold text-white">SKY WORLDWIDE</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Premium international courier & air cargo delivery services. Connecting India to the United States, UK, UAE, Europe, and 220+ worldwide destinations.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#why-choose-us" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#countries" className="hover:text-white transition">
                  Countries We Deliver
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Countries
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#countries" className="hover:text-white transition">
                  USA Express Courier
                </a>
              </li>
              <li>
                <a href="#countries" className="hover:text-white transition">
                  UK Courier Service
                </a>
              </li>
              <li>
                <a href="#countries" className="hover:text-white transition">
                  UAE & Dubai Cargo
                </a>
              </li>
              <li>
                <a href="#countries" className="hover:text-white transition">
                  Germany Express
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Head Office
            </h4>
            <p className="text-xs leading-relaxed text-slate-500 mb-3">
              Sky Worldwide Cargo Hub, Near International Airport Cargo Terminal, Sahar, Mumbai 400099, India.
            </p>
            <p className="text-xs font-semibold text-slate-300">Call: +91 98200 12345</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>© 2026 Sky Worldwide International Courier & Cargo. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex gap-4 text-base">
            <a href="#" className="text-slate-500 hover:text-white transition" aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
