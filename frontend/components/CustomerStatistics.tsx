"use client";

import React from "react";
import StatisticsCard from "./StatisticsCard";
import { CustomerRecord } from "@/services/customer";

interface CustomerStatisticsProps {
  customers: CustomerRecord[];
  isLoading?: boolean;
}

export const CustomerStatistics: React.FC<CustomerStatisticsProps> = ({
  customers,
  isLoading = false,
}) => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.status === "Active" || c.status === "VIP"
  ).length;
  const vipAccounts = customers.filter((c) => c.status === "VIP").length;
  const totalShipments = customers.reduce(
    (sum, c) => sum + (c.total_shipments || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticsCard
        title="Total Customers"
        value={totalCustomers}
        icon="fa-users"
        color="blue"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Active Accounts"
        value={activeCustomers}
        icon="fa-user-check"
        color="emerald"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="VIP Enterprise Accounts"
        value={vipAccounts}
        icon="fa-crown"
        color="purple"
        isLoading={isLoading}
      />
      <StatisticsCard
        title="Customer Shipments"
        value={totalShipments}
        icon="fa-boxes-packing"
        color="amber"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CustomerStatistics;
