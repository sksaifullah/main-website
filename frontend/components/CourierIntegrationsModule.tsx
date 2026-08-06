"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CarrierCode,
  CarrierConfigsResponse,
  AutoSyncConfig,
  SyncLogEntry,
  fetchCarrierConfigs,
  updateCarrierConfigs,
  testCarrierConnection,
  fetchAutoSyncSettings,
  updateAutoSyncSettings,
  fetchCarrierLogs,
  triggerManualSyncAll,
  CarrierConfig,
} from "@/services/carrier";
import CarrierCard from "./CarrierCard";
import { CarrierStatus } from "./CarrierStatus";
import { SynchronizationLog } from "./SynchronizationLog";
import { getErrorMessage } from "@/types";

export const CourierIntegrationsModule: React.FC = () => {
  const [configs, setConfigs] = useState<CarrierConfigsResponse | null>(null);
  const [autoSync, setAutoSync] = useState<AutoSyncConfig | null>(null);
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [configsData, autoSyncData, logsData] = await Promise.all([
        fetchCarrierConfigs(),
        fetchAutoSyncSettings(),
        fetchCarrierLogs(15),
      ]);
      setConfigs(configsData);
      setAutoSync(autoSyncData);
      setLogs(logsData);
    } catch (err: unknown) {
      console.error("Failed to load carrier configs:", err);
      setErrorMessage(getErrorMessage(err, "Failed to connect to carrier integrations backend."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchCarrierConfigs(),
      fetchAutoSyncSettings(),
      fetchCarrierLogs(15),
    ])
      .then(([configsData, autoSyncData, logsData]) => {
        if (isMounted) {
          setConfigs(configsData);
          setAutoSync(autoSyncData);
          setLogs(logsData);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to connect to carrier integrations backend."));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveCarrier = async (code: CarrierCode, updated: CarrierConfig) => {
    try {
      const payload: Partial<CarrierConfigsResponse> = {
        [code]: updated,
      };
      const result = await updateCarrierConfigs(payload);
      setConfigs(result);
      showToast(`Saved API credentials for ${code.toUpperCase()}.`);
    } catch (err: unknown) {
      alert(`Save Failed: ${getErrorMessage(err)}`);
    }
  };

  const handleTestCarrier = async (code: CarrierCode) => {
    try {
      const res = await testCarrierConnection(code);
      await loadData();
      return res;
    } catch (err: unknown) {
      return {
        success: false,
        message: getErrorMessage(err, "Connection test failed."),
      };
    }
  };

  const handleToggleAutoSync = async (enabled: boolean) => {
    try {
      const updated = await updateAutoSyncSettings({
        enabled,
        interval_minutes: autoSync?.interval_minutes || 30,
      });
      setAutoSync(updated);
      showToast(`Auto-sync updated: ${enabled ? "Enabled" : "Disabled"}.`);
    } catch (err: unknown) {
      alert(`Auto-Sync Update Error: ${getErrorMessage(err)}`);
    }
  };

  const handleSyncAllClick = async () => {
    try {
      setIsSyncingAll(true);
      const res = await triggerManualSyncAll();
      showToast(res.message || "Manual carrier sync triggered successfully.");
      await loadData();
    } catch (err: unknown) {
      alert(`Sync Error: ${getErrorMessage(err)}`);
    } finally {
      setIsSyncingAll(false);
    }
  };

  if (isLoading || !configs) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3 animate-pulse">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-[#005DC3]"></i>
        <p className="text-xs font-bold">Loading Live Courier API Credentials &amp; Sync Configuration...</p>
      </div>
    );
  }

  const activeCount = Object.values(configs).filter((c) => c?.enabled).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-800 p-3.5 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-2xl text-red-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation text-lg text-red-400"></i>
            <div>
              <p className="font-bold">Carrier API Connection Error</p>
              <p className="text-[11px] text-red-300">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-xs transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Carrier Status Bar */}
      {autoSync && (
        <CarrierStatus
          activeCount={activeCount}
          totalCount={4}
          autoSync={autoSync}
          onAutoSyncToggle={handleToggleAutoSync}
          onSyncAll={handleSyncAllClick}
          isSyncing={isSyncingAll}
        />
      )}

      {/* 4 Partner Courier API Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CarrierCard
          carrierCode="fedex"
          carrierName="FedEx Express API"
          icon="fa-[#005DC3]"
          brandColor="purple"
          config={configs.fedex}
          onSave={handleSaveCarrier}
          onTest={handleTestCarrier}
        />

        <CarrierCard
          carrierCode="dhl"
          carrierName="DHL Express API"
          icon="fa-bolt-lightning"
          brandColor="amber"
          config={configs.dhl}
          onSave={handleSaveCarrier}
          onTest={handleTestCarrier}
        />

        <CarrierCard
          carrierCode="ups"
          carrierName="UPS Logistics API"
          icon="fa-shield-halved"
          brandColor="amber"
          config={configs.ups}
          onSave={handleSaveCarrier}
          onTest={handleTestCarrier}
        />

        <CarrierCard
          carrierCode="aramex"
          carrierName="Aramex Global API"
          icon="fa-globe"
          brandColor="red"
          config={configs.aramex}
          onSave={handleSaveCarrier}
          onTest={handleTestCarrier}
        />
      </div>

      {/* Integration Sync Logs Table */}
      <SynchronizationLog logs={logs} onRefresh={loadData} />
    </div>
  );
};

export default CourierIntegrationsModule;
