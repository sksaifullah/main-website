"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeContext";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

export interface NavbarProps {
  variant?: "public" | "admin";
  onOpenQuoteModal?: () => void;
  onOpenTrackingInputModal?: () => void;
  onToggleMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  variant = "public",
  onOpenQuoteModal,
  onOpenTrackingInputModal,
  onToggleMobileDrawer,
}) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === "admin" || (!onOpenQuoteModal && !onOpenTrackingInputModal)) {
    return (
      <header
        id="admin-header"
        className="admin-header bg-slate-950/95 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-lg backdrop-blur-md"
      >
        {/* Brand Logo & Console Tag */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              id="admin-logo-img"
              src="/images/logo1.PNG"
              alt="SKY WORLDWIDE"
              width={160}
              height={40}
              className="h-10 w-auto bg-white p-1 rounded-lg object-contain"
            />
            <span className="font-extrabold text-white text-lg tracking-tight hidden sm:inline-block">
              SKY WORLDWIDE{" "}
              <span className="text-[#005DC3] text-xs px-2 py-0.5 rounded bg-blue-900/50 uppercase">
                Console
              </span>
            </span>
          </Link>
        </div>

        {/* Right Actions: Notification Bell, Theme Toggle, User Menu */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          {/* Theme Toggle */}
          <button
            id="admin-theme-toggle"
            onClick={toggleTheme}
            title="Toggle Light/Dark Mode"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 text-xs font-bold hover:bg-slate-700 transition border border-slate-700/60"
          >
            <i
              id="admin-theme-icon"
              className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
            ></i>
            <span id="admin-theme-label" className="hidden sm:inline">
              {theme === "dark" ? "Light" : "Dark"} Mode
            </span>
          </button>

          <UserMenu />
        </div>
      </header>
    );
  }

  // Public Landing Page Navbar
  return (
    <header className="header-sticky">
      <div className="w-full px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 text-decoration-none group flex-shrink-0"
          >
            <Image
              id="main-logo-img"
              src="/images/logo1.PNG"
              alt="SKY WORLDWIDE"
              width={180}
              height={64}
              className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition flex-shrink-0"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 flex-shrink-0">
            <a href="#home" className="nav-link active">
              Home
            </a>
            <a href="#why-choose-us" className="nav-link">
              About Us
            </a>
            <a href="#services" className="nav-link">
              Items We Ship
            </a>
            <a href="#countries" className="nav-link">
              Country
            </a>
            <a href="#partners" className="nav-link">
              Partners
            </a>
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#tracking" className="nav-link">
              Process
            </a>
            <a href="#rating" className="nav-link">
              Trust Us
            </a>
            <a href="#contact" className="nav-link">
              Blog
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          {/* Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              title="Toggle Dark / Light Mode"
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <i
                id="theme-toggle-icon"
                className={`fa-solid ${
                  theme === "dark" ? "fa-sun" : "fa-moon"
                } text-sm`}
              />
            </button>
            {onOpenQuoteModal && (
              <button
                onClick={onOpenQuoteModal}
                className="btn-secondary text-xs xl:text-sm py-2 px-3 xl:py-2.5 xl:px-4 whitespace-nowrap"
              >
                <i className="fa-solid fa-calculator"></i> Request Quote
              </button>
            )}
            {onOpenTrackingInputModal && (
              <button
                onClick={onOpenTrackingInputModal}
                className="btn-primary text-xs xl:text-sm py-2 px-3.5 xl:py-2.5 xl:px-5 whitespace-nowrap"
              >
                <i className="fa-solid fa-location-crosshairs"></i> Track Shipment
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          {onToggleMobileDrawer && (
            <button
              id="mobile-menu-btn"
              onClick={onToggleMobileDrawer}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
