"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

interface HistoryStep {
  stage?: string;
  status?: string;
  location?: string;
  timestamp?: string;
  date?: string;
  time?: string;
  details?: string;
}

interface TrackingData {
  tracking_number?: string;
  partner_tracking_number?: string;
  customer_name?: string;
  receiver_name?: string;
  origin?: string;
  destination?: string;
  service?: string;
  package_type?: string;
  weight?: string;
  pieces?: number;
  status?: string;
  status_code?: string;
  current_location?: string;
  last_updated?: string;
  estimated_delivery?: string;
  partner_courier?: string;
  is_live_synced?: boolean;
  manual_override?: boolean;
  history?: HistoryStep[];
}

const SeedTrackingData: { [key: string]: TrackingData } = {
  SW1001: {
    tracking_number: "SW1001",
    partner_tracking_number: "FEDEX-882190",
    customer_name: "Rajesh Sharma",
    receiver_name: "John Miller",
    origin: "Mumbai Hub, India",
    destination: "New York, USA",
    service: "Express Air Freight",
    package_type: "Commercial Box",
    weight: "4.5 kg",
    pieces: 1,
    status: "In Transit",
    status_code: "IN_TRANSIT",
    current_location: "Paris Charles de Gaulle Air Hub (CDG)",
    last_updated: "2026-03-29 14:30 IST",
    estimated_delivery: "31 Mar 2026",
    partner_courier: "FedEx Express",
    is_live_synced: true,
    history: [
      {
        stage: "Picked Up",
        status: "Shipment collected from shipper in Mumbai",
        location: "Mumbai, India",
        timestamp: "2026-03-27 10:00 IST",
      },
      {
        stage: "Customs Cleared",
        status: "Export customs documentation verified at BOM airport",
        location: "Mumbai Airport (BOM)",
        timestamp: "2026-03-28 02:15 IST",
      },
      {
        stage: "In Transit",
        status: "Arrived at international sorting facility",
        location: "Paris CDG Hub",
        timestamp: "2026-03-29 14:30 IST",
      },
    ],
  },
};

interface TrackingModalProps {
  trackingNumber: string | null;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  trackingNumber,
  onClose,
}) => {
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(trackingNumber));
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!trackingNumber) return;

    let isMounted = true;

    fetch(`${API_BASE}/api/tracking/${encodeURIComponent(trackingNumber)}?_t=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!isMounted) return;

        if (res.ok && json.data) {
          setData(json.data);
          setLoading(false);
        } else if (res.ok && json.tracking_number) {
          setData(json);
          setLoading(false);
        } else {
          const seed = SeedTrackingData[trackingNumber];
          if (seed) {
            setData(seed);
          } else {
            setNotFound(true);
            setErrorMsg(json.detail || json.message || `No tracking record found for "${trackingNumber}"`);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const seed = SeedTrackingData[trackingNumber];
        if (seed) {
          setData(seed);
        } else {
          setNotFound(true);
          setErrorMsg(err.message || "Failed to communicate with tracking server.");
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [trackingNumber]);

  if (!trackingNumber) return null;

  const isDelivered =
    data?.status_code === "DELIVERED" || (data?.status || "").toLowerCase() === "delivered";
  const isOut =
    data?.status_code === "OUT_FOR_DELIVERY" ||
    (data?.status || "").toLowerCase().includes("out for delivery");
  const isWaiting = data?.status_code === "WAITING";

  const courierName = data?.partner_courier || "Partner Courier";
  const isLiveSynced = Boolean(data?.is_live_synced && !data?.manual_override);

  const headerTitle = isLiveSynced ? "Official Courier Live Tracking" : "Sky Worldwide Express Tracking";
  const headerSubtitle = isLiveSynced ? `Direct API Telemetry via ${courierName}` : "Internal Hub Logistics Tracking";
  const trackingNumberLabel = isLiveSynced ? `${courierName} AWB #` : "Internal Waybill #";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-3xl w-full">
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl">
            <i className="fa-solid fa-spinner animate-spin text-4xl text-[#005DC3]"></i>
            <div>
              <p className="font-extrabold text-base">Fetching Real-Time Tracking Telemetry...</p>
              <p className="text-xs text-slate-400 mt-1 font-mono">Querying AWB #{trackingNumber}</p>
            </div>
          </div>
        )}

        {!loading && notFound && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center text-2xl mx-auto border border-red-800/60">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Waybill Record Not Found</h3>
              <p className="text-xs text-slate-400 mt-1">{errorMsg}</p>
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center cursor-pointer">
              Close
            </button>
          </div>
        )}

        {!loading && data && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 right-0 flex justify-between items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-4 pt-1 border-b border-slate-100 dark:border-slate-800 z-20 mb-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo1.PNG"
                  alt="Sky Worldwide"
                  width={120}
                  height={32}
                  className="h-8 w-auto bg-white p-1 rounded-lg object-contain border border-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-[#005DC3] uppercase tracking-wider block">
                    {headerTitle}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{headerSubtitle}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition flex-shrink-0 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Tracking ID Banner & Status Badge */}
            <div className="bg-gradient-to-r from-slate-900 via-[#00398A] to-[#005DC3] rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">
                    {trackingNumberLabel}
                  </p>
                  <p className="text-2xl font-black font-mono tracking-wider text-white mt-0.5">
                    {data.partner_tracking_number || data.tracking_number}
                  </p>
                  <p className="text-xs text-blue-100 mt-2 font-medium">
                    Consignee: <strong className="text-white">{data.receiver_name || "Valued Recipient"}</strong>
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg uppercase tracking-wider ${
                      isDelivered
                        ? "bg-emerald-500 text-white"
                        : isOut
                        ? "bg-blue-500 text-white animate-pulse"
                        : isWaiting
                        ? "bg-amber-500 text-slate-950"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <i className={`fa-solid ${isDelivered ? "fa-circle-check" : "fa-plane-departure"}`}></i>
                    {data.status || "In Transit"}
                  </span>
                  {data.last_updated && (
                    <p className="text-[10px] text-blue-200 mt-2 font-mono text-right">
                      Updated: {data.last_updated}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Timeline Summary Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                  ORIGIN LOCATION
                </span>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-[#005DC3]"></i>
                  {data.origin || "Origin Hub"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                  DESTINATION LOCATION
                </span>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-[#005DC3] text-emerald-500"></i>
                  {data.destination || "Destination Address"}
                </p>
              </div>
            </div>

            {/* Detailed Tracking Milestone History */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-[#005DC3]"></i> Transit Checkpoint History
              </h4>

              <div className="space-y-3 relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                {data.history && data.history.length > 0 ? (
                  data.history.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#005DC3] border-4 border-white dark:border-slate-900 shadow-md"></div>
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {step.stage || step.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {step.timestamp || `${step.date || ""} ${step.time || ""}`}
                          </span>
                        </div>
                        {step.location && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            Location: {step.location}
                          </p>
                        )}
                        {step.details && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">{step.details}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No detailed checkpoint history available.</p>
                )}
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="btn-secondary py-2 px-4 text-xs font-bold cursor-pointer"
              >
                <i className="fa-solid fa-print"></i> Print Waybill
              </button>
              <button
                onClick={onClose}
                className="btn-primary py-2 px-5 text-xs font-bold cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingModal;
