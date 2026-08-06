"use client";

import React from "react";
import { TimelineEventItem } from "../../types/tracking";
import { TimelineEvent } from "./TimelineEvent";

interface TrackingTimelineProps {
  history: TimelineEventItem[];
  partnerCourier?: string;
  isLiveSynced?: boolean;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  history,
  partnerCourier,
  isLiveSynced = false,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
        No tracking history recorded yet.
      </div>
    );
  }

  const timelineTitle = isLiveSynced && partnerCourier
    ? `${partnerCourier} Official Live Timeline (Newest First)`
    : "Shipment Tracking Timeline";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8">
      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <i className="fa-solid fa-timeline text-[#005DC3] dark:text-sky-400"></i> {timelineTitle}
      </h3>
      <div className="mt-2 space-y-1">
        {history.map((event, idx) => (
          <TimelineEvent
            key={idx}
            event={event}
            index={idx}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
