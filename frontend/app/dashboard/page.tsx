"use client";

import React, { useEffect, useState, useCallback } from "react";
import StatisticsCard from "@/components/StatisticsCard";
import RecentShipments from "@/components/RecentShipments";
import ActivityLog from "@/components/ActivityLog";
import ShipmentModal, { ModalMode } from "@/components/ShipmentModal";
import CourierIntegrationsModule from "@/components/CourierIntegrationsModule";
import QuickActions from "@/components/QuickActions";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { fetchDashboardData, DashboardStats } from "@/services/dashboard";
import {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
  syncShipment,
  syncAllCarriers,
  bulkDeleteShipments,
  bulkUpdateStatus,
} from "@/services/shipment";
import {
  ShipmentDetailsData,
  SyncLogEntry,
  CreateShipmentPayload,
  getErrorMessage,
} from "@/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0,
    cancelled: 0,
    totalRevenue: 482900,
    activeCustomers: 340,
  });
  const [shipments, setShipments] = useState<ShipmentDetailsData[]>([]);
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeShipment, setActiveShipment] = useState<ShipmentDetailsData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [dashData, shipmentsRes] = await Promise.all([
        fetchDashboardData(),
        getShipments(),
      ]);

      const items = shipmentsRes.shipments || [];
      setShipments(items);
      setLogs(dashData.logs || []);

      // Recompute stats from fresh shipments list
      setStats({
        totalShipments: items.length,
        delivered: items.filter(
          (x: ShipmentDetailsData) => (x.status || "").toLowerCase() === "delivered"
        ).length,
        pending: items.filter(
          (x: ShipmentDetailsData) => Boolean(x.partner_courier) || Boolean(x.partner_tracking_number)
        ).length,
        inTransit: items.filter((x: ShipmentDetailsData) => {
          const st = (x.status || "").toLowerCase();
          return st.includes("transit") || st.includes("flight") || st.includes("hub");
        }).length,
        cancelled: items.filter(
          (x: ShipmentDetailsData) => (x.status || "").toLowerCase() === "cancelled"
        ).length,
        totalRevenue: dashData.totalRevenue || 482900,
        activeCustomers: dashData.activeCustomers || 340,
      });
    } catch (err: unknown) {
      console.error("Error loading dashboard data:", err);
      setErrorMessage(getErrorMessage(err, "Failed to load dashboard data from backend server."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchDashboardData(), getShipments()])
      .then(([dashData, shipmentsRes]) => {
        if (isMounted) {
          const items = shipmentsRes.shipments || [];
          setShipments(items);
          setLogs(dashData.logs || []);
          setStats({
            totalShipments: items.length,
            delivered: items.filter(
              (x: ShipmentDetailsData) => (x.status || "").toLowerCase() === "delivered"
            ).length,
            pending: items.filter(
              (x: ShipmentDetailsData) => Boolean(x.partner_courier) || Boolean(x.partner_tracking_number)
            ).length,
            inTransit: items.filter((x: ShipmentDetailsData) => {
              const st = (x.status || "").toLowerCase();
              return st.includes("transit") || st.includes("flight") || st.includes("hub");
            }).length,
            cancelled: items.filter(
              (x: ShipmentDetailsData) => (x.status || "").toLowerCase() === "cancelled"
            ).length,
            totalRevenue: dashData.totalRevenue || 482900,
            activeCustomers: dashData.activeCustomers || 340,
          });
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to load dashboard data."));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setActiveShipment(null);
    setModalMode("create");
  };

  const handleOpenViewModal = (shipment: ShipmentDetailsData) => {
    setActiveShipment(shipment);
    setModalMode("view");
  };

  const handleOpenEditModal = (shipment: ShipmentDetailsData) => {
    setActiveShipment(shipment);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setActiveShipment(null);
  };

  const handleFormSubmit = async (payload: CreateShipmentPayload) => {
    try {
      setIsSubmitting(true);
      if (modalMode === "create") {
        await createShipment(payload);
      } else if (modalMode === "edit" && activeShipment) {
        await updateShipment(activeShipment.tracking_number, payload);
      }
      handleCloseModal();
      await loadData();
    } catch (err: unknown) {
      alert(`Operation failed: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncShipment = async (trackingNum: string) => {
    try {
      await syncShipment(trackingNum);
      await loadData();
    } catch (err: unknown) {
      alert(`Sync failed: ${getErrorMessage(err)}`);
    }
  };

  const handleDeleteShipment = async (trackingNum: string) => {
    if (!confirm(`Are you sure you want to delete shipment ${trackingNum}?`)) return;
    try {
      await deleteShipment(trackingNum);
      await loadData();
    } catch (err: unknown) {
      alert(`Delete failed: ${getErrorMessage(err)}`);
    }
  };

  const handleSyncAllCarriers = async () => {
    try {
      await syncAllCarriers();
      await loadData();
    } catch (err: unknown) {
      alert(`Sync error: ${getErrorMessage(err)}`);
    }
  };

  const handleExportCSV = () => {
    if (shipments.length === 0) {
      alert("No shipment records available to export.");
      return;
    }
    const headers = [
      "Internal AWB #",
      "Courier Partner",
      "Partner AWB #",
      "Consignor",
      "Consignee",
      "Origin",
      "Destination",
      "Weight",
      "Status",
      "Est Delivery",
    ];
    const rows = shipments.map((s) => [
      `"${s.tracking_number}"`,
      `"${s.partner_courier || ""}"`,
      `"${s.partner_tracking_number || ""}"`,
      `"${s.customer_name || ""}"`,
      `"${s.receiver_name || ""}"`,
      `"${s.origin || ""}"`,
      `"${s.destination || ""}"`,
      `"${s.weight || ""}"`,
      `"${s.status || ""}"`,
      `"${s.estimated_delivery || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `sky_worldwide_shipments_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} selected shipments?`)) return;
    try {
      await bulkDeleteShipments(ids);
      await loadData();
    } catch (err: unknown) {
      alert(`Bulk delete error: ${getErrorMessage(err)}`);
    }
  };

  const handleBulkStatusUpdate = async (ids: string[], newStatus: string) => {
    try {
      await bulkUpdateStatus(ids, newStatus);
      await loadData();
    } catch (err: unknown) {
      alert(`Bulk status update error: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Workspace Area */}
        <main className="flex-1 space-y-6">
          {/* Header Banner & Live Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                <i className="fa-solid fa-gauge-high text-[#005DC3]"></i> Logistics Control Tower
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time express air cargo operations &amp; courier integrations telemetry.
              </p>
            </div>

            <QuickActions
              onNewShipment={handleOpenCreateModal}
              onSyncAll={handleSyncAllCarriers}
              onExportCSV={handleExportCSV}
            />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-950/80 border border-red-800 p-4 rounded-2xl text-red-200 text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-lg text-red-400"></i>
                <div>
                  <p className="font-bold">Dashboard Connection Error</p>
                  <p className="text-[11px] text-red-300">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-xs transition cursor-pointer"
              >
                Retry Load
              </button>
            </div>
          )}

          {activeTab === "overview" && (
            <>
              {/* Executive Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticsCard
                  title="Total Waybills"
                  value={stats.totalShipments}
                  icon="fa-boxes-packing"
                  color="blue"
                  trend="+12% from last month"
                  isLoading={isLoading}
                />
                <StatisticsCard
                  title="In Transit / Flight"
                  value={stats.inTransit}
                  icon="fa-plane-departure"
                  color="purple"
                  trend="Live AWB telemetry"
                  isLoading={isLoading}
                />
                <StatisticsCard
                  title="Successfully Delivered"
                  value={stats.delivered}
                  icon="fa-circle-check"
                  color="emerald"
                  trend="98.4% On-time SLA"
                  isLoading={isLoading}
                />
                <StatisticsCard
                  title="Pending Customs / Hub"
                  value={stats.pending}
                  icon="fa-clock"
                  color="amber"
                  trend="Under inspection"
                  isLoading={isLoading}
                />
              </div>

              {/* Main Content Layout Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Active Shipments Panel */}
                <div className="xl:col-span-2 space-y-6">
                  <RecentShipments
                    shipments={shipments}
                    isLoading={isLoading}
                    onOpenCreate={handleOpenCreateModal}
                    onView={handleOpenViewModal}
                    onEdit={handleOpenEditModal}
                    onSync={handleSyncShipment}
                    onDelete={handleDeleteShipment}
                    onSyncAllCarriers={handleSyncAllCarriers}
                    onExportCSV={handleExportCSV}
                    onBulkDelete={handleBulkDelete}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
                  />
                </div>

                {/* Audit Logs Sidebar Panel */}
                <div className="space-y-6">
                  <ActivityLog logs={logs} isLoading={isLoading} onRefresh={loadData} />
                </div>
              </div>
            </>
          )}

          {activeTab === "couriers" && (
            <CourierIntegrationsModule />
          )}

          {/* Shipment Modal (Create / Edit / View) */}
          {modalMode && (
            <ShipmentModal
              isOpen={Boolean(modalMode)}
              mode={modalMode}
              shipment={activeShipment}
              isSubmitting={isSubmitting}
              onClose={handleCloseModal}
              onSubmit={handleFormSubmit}
              onSync={activeShipment ? () => handleSyncShipment(activeShipment.partner_tracking_number || activeShipment.tracking_number) : undefined}
            />
          )}
        </main>
      </div>
    </div>
  );
}
