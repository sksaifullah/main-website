"use client";

import React from "react";

interface CountrySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CountrySearch: React.FC<CountrySearchProps> = ({
  value,
  onChange,
  placeholder = "Search Country Name, Code (US, GB, AE), Currency, Timezone, Cities...",
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <i className="fa-solid fa-magnifying-glass text-xs"></i>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 transition outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition"
          title="Clear search"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      )}
    </div>
  );
};

export default CountrySearch;
