"use client";

import React from "react";
import StatisticsCard from "./StatisticsCard";
import { AnalyticsSummary } from "@/services/analytics";

interface AnalyticsCardsProps {
  data: AnalyticsSummary;
  isLoading?: boolean;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  data,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatisticsCard
        title="Total Shipments"
        value={data.total_shipments}
        icon="fa-boxes-packing"
        color="blue"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Delivered"
        value={data.delivered_shipments}
        icon="fa-circle-check"
        color="emerald"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="In Transit"
        value={data.in_transit_shipments}
        icon="fa-truck-fast"
        color="amber"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Pending Processing"
        value={data.pending_shipments}
        icon="fa-clock"
        color="purple"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Est. Gross Revenue"
        value={`$${data.estimated_revenue.toLocaleString()}`}
        icon="fa-dollar-sign"
        color="emerald"
        isLoading={isLoading}
      />
    </div>
  );
};

export default AnalyticsCards;
