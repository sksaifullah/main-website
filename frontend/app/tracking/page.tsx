"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeContext";
import { ToastContainer, showToast } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Footer } from "@/components/Footer";
import { QuoteModal } from "@/components/QuoteModal";
import { TrackingInputModal } from "@/components/TrackingInputModal";
import { TrackingSearch } from "@/components/tracking/TrackingSearch";
import { TrackingLoader } from "@/components/tracking/TrackingLoader";
import { TrackingError } from "@/components/tracking/TrackingError";
import { TrackingStatusCard } from "@/components/tracking/TrackingStatusCard";
import { ShipmentProgress } from "@/components/tracking/ShipmentProgress";
import { ShipmentDetails } from "@/components/tracking/ShipmentDetails";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { getShipmentTracking } from "@/services/tracking";
import { ShipmentDetailsData, getErrorMessage } from "@/types";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialNum = searchParams.get("num") || searchParams.get("tn") || "";

  const [activeNum, setActiveNum] = useState<string>(initialNum);
  const [shipmentData, setShipmentData] = useState<ShipmentDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(initialNum));
  const [error, setError] = useState<string | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isTrackingInputModalOpen, setIsTrackingInputModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSearch = async (num: string) => {
    const trimmed = num.trim();
    if (!trimmed) return;

    setActiveNum(trimmed);
    setLoading(true);
    setError(null);
    setShipmentData(null);

    try {
      const data = await getShipmentTracking(trimmed);
      setShipmentData(data);
      showToast(`Tracking status loaded for ${trimmed}`, "success");
    } catch (err: unknown) {
      console.warn("Tracking fetch error:", err);
      const msg = getErrorMessage(err, `Shipment details not found for ${trimmed}`);
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialNum) return;
    const trimmed = initialNum.trim();
    if (!trimmed) return;

    let isMounted = true;

    getShipmentTracking(trimmed)
      .then((data) => {
        if (isMounted) {
          setShipmentData(data);
          setLoading(false);
          showToast(`Tracking status loaded for ${trimmed}`, "success");
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = getErrorMessage(err, `Shipment details not found for ${trimmed}`);
          setError(msg);
          setLoading(false);
          showToast(msg, "error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialNum]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
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

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Box Component */}
          <TrackingSearch
            initialValue={activeNum}
            onSearch={handleSearch}
            isLoading={loading}
          />

          {/* Loading State */}
          {loading && <TrackingLoader trackingNumber={activeNum} />}

          {/* Error State */}
          {!loading && error && (
            <TrackingError
              trackingNumber={activeNum}
              errorMessage={error}
              onRetry={() => handleSearch(activeNum)}
            />
          )}

          {/* Success Result Component Flow */}
          {!loading && !error && shipmentData && (
            <div className="space-y-6">
              {/* Header Status Card */}
              <TrackingStatusCard data={shipmentData} />

              {/* Progress Bar */}
              <ShipmentProgress data={shipmentData} />

              {/* Route & Package Details */}
              <ShipmentDetails data={shipmentData} />

              {/* Milestones Timeline */}
              <TrackingTimeline
                history={shipmentData.history || []}
                partnerCourier={shipmentData.partner_courier}
                isLiveSynced={Boolean(
                  shipmentData.is_live_synced && !shipmentData.manual_override
                )}
              />

              {/* Actions Footer Bar */}
              <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Current Location:{" "}
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {shipmentData.current_location}
                  </strong>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary py-2.5 px-5 text-xs font-bold cursor-pointer"
                  >
                    <i className="fa-solid fa-print"></i> Print Waybill
                  </button>
                  <a
                    href="https://wa.me/919820012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-2.5 px-5 text-xs font-bold cursor-pointer"
                  >
                    <i className="fa-brands fa-whatsapp"></i> Contact Support
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <TrackingInputModal
        isOpen={isTrackingInputModalOpen}
        onClose={() => setIsTrackingInputModalOpen(false)}
        onSearch={handleSearch}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Tracking Portal...</div>}>
        <TrackingContent />
      </Suspense>
    </ThemeProvider>
  );
}
