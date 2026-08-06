"use client";

import React from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: () => void;
  onOpenTrackingInputModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
  onOpenTrackingInputModal,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-drawer"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-all"
    >
      <div className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">
              SKY WORLDWIDE
            </span>
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
              aria-label="Close Mobile Menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <nav className="flex flex-col gap-3 mt-6">
            <a
              href="#home"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Home
            </a>
            <a
              href="#why-choose-us"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              About Us
            </a>
            <a
              href="#services"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Items We Ship
            </a>
            <a
              href="#countries"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Country
            </a>
            <a
              href="#partners"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Partners
            </a>
            <a
              href="#services"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Services
            </a>
            <a
              href="#tracking"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Process
            </a>
            <a
              href="#rating"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Trust Us
            </a>
            <a
              href="#contact"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Blog
            </a>
            <a
              href="#contact"
              onClick={onClose}
              className="font-semibold text-slate-700 dark:text-slate-200 p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenQuoteModal();
            }}
            className="btn-secondary justify-center w-full"
          >
            Request Quote
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenTrackingInputModal();
            }}
            className="btn-primary justify-center w-full"
          >
            Track Shipment
          </button>
        </div>
      </div>
    </div>
  );
};
