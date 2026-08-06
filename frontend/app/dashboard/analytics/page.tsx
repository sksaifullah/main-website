"use client";

import React, { useEffect, useState } from "react";
import AnalyticsCards from "@/components/AnalyticsCards";
import RevenueChart from "@/components/RevenueChart";
import ShipmentChart from "@/components/ShipmentChart";
import CountryChart from "@/components/CountryChart";
import CourierChart from "@/components/CourierChart";
import RecentActivity from "@/components/RecentActivity";
import StatisticsGrid from "@/components/StatisticsGrid";
import DateRangePicker, { DateRangeOption } from "@/components/DateRangePicker";
import { AnalyticsSummary, fetchAnalyticsData } from "@/services/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>("30days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAnalyticsData(dateRange)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error("Failed to load analytics:", e);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dateRange]);

  const handleDateRangeChange = (newRange: DateRangeOption) => {
    setIsLoading(true);
    setDateRange(newRange);
  };

  const handleExportReport = () => {
    if (!data) return;
    const reportStr = JSON.stringify(data, null, 2);
    const blob = new Blob([reportStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Analytics &amp; Performance Intelligence Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Real-time tracking statistics, revenue metrics, top country destinations, and carrier API performance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <button
            onClick={handleExportReport}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap"
          >
            <i className="fa-solid fa-download text-emerald-400"></i> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {data && <AnalyticsCards data={data} isLoading={isLoading} />}

      {/* Main Charts Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart monthlyData={data.monthly_stats || []} />
          <ShipmentChart dailyData={data.daily_stats || []} />
          <CountryChart topCountries={data.top_countries} />
          <CourierChart topCouriers={data.top_couriers} />
        </div>
      )}

      {/* Performance Grid & Recent Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-white text-sm">Key Performance Indicators (KPIs)</h3>
          <StatisticsGrid />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
