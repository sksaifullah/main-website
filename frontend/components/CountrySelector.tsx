"use client";

import React from "react";
import Image from "next/image";

export interface CountryOption {
  code: string;
  name: string;
  flagUrl: string;
  zone: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "US", name: "USA", flagUrl: "https://flagcdn.com/w80/us.png", zone: "Zone A (North America)" },
  { code: "GB", name: "United Kingdom", flagUrl: "https://flagcdn.com/w80/gb.png", zone: "Zone B (Europe)" },
  { code: "AE", name: "UAE", flagUrl: "https://flagcdn.com/w80/ae.png", zone: "Zone C (Middle East)" },
  { code: "AU", name: "Australia", flagUrl: "https://flagcdn.com/w80/au.png", zone: "Zone D (Asia Pacific)" },
  { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/w80/ca.png", zone: "Zone A (North America)" },
  { code: "DE", name: "Germany", flagUrl: "https://flagcdn.com/w80/de.png", zone: "Zone B (Europe)" },
  { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w80/sa.png", zone: "Zone C (Middle East)" },
  { code: "SG", name: "Singapore", flagUrl: "https://flagcdn.com/w80/sg.png", zone: "Zone D (Asia Pacific)" },
];

interface CountrySelectorProps {
  value: string;
  onChange: (countryName: string, zone?: string) => void;
  disabled?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const found = COUNTRY_OPTIONS.find((c) => c.name === selectedName);
    onChange(selectedName, found?.zone);
  };

  const currentCountry = COUNTRY_OPTIONS.find((c) => c.name === value);

  return (
    <div className="space-y-1">
      <label className="block text-slate-300 font-bold text-xs mb-1">
        Destination Country <span className="text-red-400">*</span>
      </label>
      <div className="relative flex items-center">
        {currentCountry?.flagUrl && (
          <Image
            src={currentCountry.flagUrl}
            alt={currentCountry.name}
            width={20}
            height={14}
            unoptimized
            className="w-5 h-3.5 object-cover rounded absolute left-3 pointer-events-none"
          />
        )}
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 text-xs text-white font-semibold outline-none focus:border-[#005DC3] ${
            currentCountry?.flagUrl ? "pl-10" : "px-3"
          }`}
        >
          <option value="">Select Country</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name} ({c.zone})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CountrySelector;
