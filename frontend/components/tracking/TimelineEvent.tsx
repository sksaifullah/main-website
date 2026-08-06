"use client";

import React from "react";
import { TimelineEventItem } from "../../types/tracking";

interface TimelineEventProps {
  event: TimelineEventItem;
  index: number;
  isLast: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  isLast,
}) => {
  const isCompleted = event.completed !== false;
  const stageTitle = event.stage || event.status || "Status Update";
  const timestampText =
    event.timestamp || (event.date ? `${event.date} ${event.time || ""}` : "Pending");
  const detailsText = event.details || event.description || "";

  return (
    <div
      className={`flex gap-4 items-start relative pb-6 ${
        isLast ? "" : "border-l-2 border-blue-200 dark:border-slate-700 ml-4 pl-6"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full ${
          isCompleted
            ? "bg-[#005DC3] text-white shadow-md"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
        } flex items-center justify-center font-bold text-xs flex-shrink-0 -ml-4 z-10`}
      >
        {isCompleted ? <i className="fa-solid fa-check text-xs"></i> : index + 1}
      </div>

      <div className="flex-1 bg-slate-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4
            className={`font-bold text-sm ${
              isCompleted ? "text-slate-900 dark:text-white" : "text-slate-500"
            }`}
          >
            {stageTitle}
          </h4>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {timestampText}
          </span>
        </div>

        {event.location && (
          <p className="text-xs text-[#005DC3] dark:text-sky-400 font-semibold mt-1">
            <i className="fa-solid fa-location-dot mr-1"></i> {event.location}{" "}
            {event.courier && (
              <>
                • <span className="text-slate-600 dark:text-slate-300 font-bold">{event.courier}</span>
              </>
            )}
          </p>
        )}

        {detailsText && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            {detailsText}
          </p>
        )}
      </div>
    </div>
  );
};
