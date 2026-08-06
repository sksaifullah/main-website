"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { ToastContainer } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { CountriesSection } from "@/components/CountriesSection";
import { RatingSection } from "@/components/RatingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { TrackingInputModal } from "@/components/TrackingInputModal";
import { TrackingModal } from "@/components/TrackingModal";
import { QuoteModal } from "@/components/QuoteModal";

export default function Home() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isTrackingInputModalOpen, setIsTrackingInputModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string | null>(null);

  const handleTrackSearch = (num: string) => {
    setActiveTrackingNumber(num);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <ToastContainer />

        <Navbar
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          onOpenTrackingInputModal={() => setIsTrackingInputModalOpen(true)}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        />

        <MobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          onOpenTrackingInputModal={() => setIsTrackingInputModalOpen(true)}
        />

        <main className="flex-grow">
          <HeroSection
            onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
            onTrackSearch={handleTrackSearch}
          />
          <ServicesSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
          <WhyChooseUsSection />
          <PartnersSection />
          <CountriesSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
          <RatingSection />
          <ContactSection />
        </main>

        <Footer />

        <TrackingInputModal
          isOpen={isTrackingInputModalOpen}
          onClose={() => setIsTrackingInputModalOpen(false)}
          onSearch={handleTrackSearch}
        />

        <TrackingModal
          trackingNumber={activeTrackingNumber}
          onClose={() => setActiveTrackingNumber(null)}
        />

        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}