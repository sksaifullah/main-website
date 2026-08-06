"use client";

import React from "react";

export type DateRangeOption = "today" | "7days" | "30days" | "year" | "all";

interface DateRangePickerProps {
  value: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const options: { id: DateRangeOption; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7days", label: "Last 7 Days" },
    { id: "30days", label: "Last 30 Days" },
    { id: "year", label: "This Year" },
    { id: "all", label: "All Time" },
  ];

  return (
    <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-1 shadow-inner">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            value === opt.id
              ? "bg-[#005DC3] text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default DateRangePicker;
