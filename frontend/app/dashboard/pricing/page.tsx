"use client";

import React, { useEffect, useState, useCallback } from "react";
import PriceCard from "@/components/PriceCard";
import PricingSearch from "@/components/PricingSearch";
import PricingFilters from "@/components/PricingFilters";
import PricingTable from "@/components/PricingTable";
import PricingForm from "@/components/PricingForm";
import WeightTable from "@/components/WeightTable";
import {
  PricingRecord,
  CreatePricingPayload,
  getPricingList,
  createPricingRecord,
  updatePricingRecord,
  deletePricingRecord,
  exportPricingCSV,
  getErrorMessage,
} from "@/services/pricing";

export default function PricingPage() {
  const [records, setRecords] = useState<PricingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PricingRecord | null>(null);
  const [viewingSlabsRecord, setViewingSlabsRecord] = useState<PricingRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getPricingList();
      setRecords(data);
    } catch (err: unknown) {
      console.error("Failed to load pricing matrix:", err);
      setErrorMessage(getErrorMessage(err, "Failed to load pricing matrix from server."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getPricingList()
      .then((data) => {
        if (isMounted) {
          setRecords(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to load pricing matrix."));
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

  // Filter records
  const filteredRecords = records.filter((p) => {
    const s = search.toLowerCase().trim();
    const countryMatch = (p.country || "").toLowerCase().includes(s);
    const zoneMatch = (p.zone || "").toLowerCase().includes(s);
    const categoryMatch = (p.category || "").toLowerCase().includes(s);
    const notesMatch = (p.notes || "").toLowerCase().includes(s);

    const searchPass = !s || countryMatch || zoneMatch || categoryMatch || notesMatch;
    const zonePass = !zone || p.zone.toLowerCase().includes(zone.toLowerCase());
    const categoryPass = !category || p.category.toLowerCase().includes(category.toLowerCase());
    const currencyPass = !currency || p.currency === currency;

    return searchPass && zonePass && categoryPass && currencyPass;
  });

  const total = filteredRecords.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  // Handlers
  const handleOpenCreate = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: PricingRecord) => {
    setEditingRecord(p);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleFormSubmit = async (payload: CreatePricingPayload) => {
    try {
      setIsSubmitting(true);
      if (editingRecord) {
        await updatePricingRecord(editingRecord.id, payload);
        showToast(`Pricing slab for ${payload.country} updated successfully.`);
      } else {
        await createPricingRecord(payload);
        showToast(`Pricing slab for ${payload.country} created successfully.`);
      }
      handleCloseForm();
      await loadData();
    } catch (err: unknown) {
      alert(`Save Error: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePricingRecord(id);
      showToast("Pricing slab deleted successfully.");
      await loadData();
    } catch (err: unknown) {
      alert(`Delete Error: ${getErrorMessage(err)}`);
    }
  };

  const handleExportCSV = () => {
    exportPricingCSV(filteredRecords);
  };

  // Metrics calculation
  const lowestRate = records.length > 0
    ? Math.min(...records.map((r) => r.base_express_price))
    : 10;
  const activeZonesCount = new Set(records.map((r) => r.zone)).size;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-800 p-3.5 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white"
          >
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
              <p className="font-bold">Database Error</p>
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

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PriceCard
          title="Active Rates Slabs"
          value={records.length}
          icon="fa-tags"
          color="blue"
          trend="Matrix Configured"
        />
        <PriceCard
          title="Active Shipping Zones"
          value={activeZonesCount}
          icon="fa-[#005DC3]"
          color="purple"
          trend="Worldwide Hubs"
        />
        <PriceCard
          title="Base Express Price"
          value={`$${lowestRate}`}
          icon="fa-bolt-lightning"
          color="emerald"
          trend="Starting Rate"
        />
        <PriceCard
          title="Service Categories"
          value={4}
          icon="fa-[#005DC3]"
          color="amber"
          trend="Express Air / Food / Pharma"
        />
      </div>

      {/* Main Pricing Module Card */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              International Air Freight Pricing &amp; Slabs Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Manage base tariffs, weight breakdown slabs (0.5kg - 50+kg), zone multipliers, and category rates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2"
            >
              <i className="fa-solid fa-file-export text-emerald-400"></i> Export Matrix CSV
            </button>

            <button
              onClick={handleOpenCreate}
              className="btn-primary px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add New Pricing Slab
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
          <PricingSearch value={search} onChange={setSearch} />
          <PricingFilters
            zone={zone}
            category={category}
            currency={currency}
            onZoneChange={setZone}
            onCategoryChange={setCategory}
            onCurrencyChange={setCurrency}
          />
        </div>

        {/* Pricing Table */}
        <PricingTable
          records={paginatedRecords}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewSlabs={(p) => setViewingSlabsRecord(p)}
        />

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/80 text-xs text-slate-400 font-medium">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, total)} of {total} pricing records
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-40 transition font-bold"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-white">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-40 transition font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Form Modal */}
      {isFormOpen && (
        <PricingForm
          initialData={editingRecord}
          isSubmitting={isSubmitting}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {/* Weight Slabs Breakdown Modal */}
      {viewingSlabsRecord && (
        <WeightTable
          record={viewingSlabsRecord}
          onClose={() => setViewingSlabsRecord(null)}
        />
      )}
    </div>
  );
}
