"use client";

import React from "react";
import { CountryRecord } from "@/services/country";
import StatisticsCard from "./StatisticsCard";

interface CountryStatisticsProps {
  countries: CountryRecord[];
  isLoading?: boolean;
}

export const CountryStatistics: React.FC<CountryStatisticsProps> = ({
  countries,
  isLoading = false,
}) => {
  const totalCountries = countries.length;
  const enabledCount = countries.filter((c) => c.is_enabled).length;
  const expressFastCount = countries.filter((c) =>
    (c.delivery_time || "").includes("2–3") || (c.delivery_time || "").includes("3–5")
  ).length;
  const currenciesCount = new Set(countries.map((c) => c.currency)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticsCard
        title="Total Served Countries"
        value={totalCountries}
        icon="fa-globe"
        color="blue"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Active Express Routes"
        value={enabledCount}
        icon="fa-circle-check"
        color="emerald"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Fast Express (2–4 Days)"
        value={expressFastCount}
        icon="fa-[#005DC3] fa-bolt"
        color="amber"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Supported Currencies"
        value={currenciesCount}
        icon="fa-money-bill-wave"
        color="purple"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CountryStatistics;
