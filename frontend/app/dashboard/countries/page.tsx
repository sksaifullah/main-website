"use client";

import React, { useEffect, useState, useCallback } from "react";
import CountryStatistics from "@/components/CountryStatistics";
import CountrySearch from "@/components/CountrySearch";
import CountryFilters from "@/components/CountryFilters";
import CountryActions from "@/components/CountryActions";
import CountryTable from "@/components/CountryTable";
import CountryCard from "@/components/CountryCard";
import CountryForm from "@/components/CountryForm";
import {
  CountryRecord,
  CreateCountryPayload,
  getCountriesList,
  createCountryRecord,
  updateCountryRecord,
  toggleCountryEnabled,
  deleteCountryRecord,
  exportCountriesCSV,
  getErrorMessage,
} from "@/services/country";

export default function CountriesPage() {
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View Mode: "table" or "grid"
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getCountriesList();
      setCountries(data);
    } catch (err: unknown) {
      console.error("Failed to load country list:", err);
      setErrorMessage(getErrorMessage(err, "Failed to load country dataset."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getCountriesList()
      .then((data) => {
        if (isMounted) {
          setCountries(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to load country dataset."));
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

  // Filter countries
  const filteredCountries = countries.filter((c) => {
    const s = search.toLowerCase().trim();
    const nameMatch = (c.name || "").toLowerCase().includes(s);
    const codeMatch = (c.code || "").toLowerCase().includes(s);
    const currencyMatch = (c.currency || "").toLowerCase().includes(s);
    const timezoneMatch = (c.timezone || "").toLowerCase().includes(s);
    const citiesMatch = (c.major_cities || "").toLowerCase().includes(s);

    const searchPass =
      !s || nameMatch || codeMatch || currencyMatch || timezoneMatch || citiesMatch;

    const statusPass =
      !statusFilter ||
      (statusFilter === "enabled" && c.is_enabled) ||
      (statusFilter === "disabled" && !c.is_enabled);

    const currencyPass = !currencyFilter || c.currency === currencyFilter;

    return searchPass && statusPass && currencyPass;
  });

  const total = filteredCountries.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, startIndex + pageSize);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCountry(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c: CountryRecord) => {
    setEditingCountry(c);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCountry(null);
  };

  const handleFormSubmit = async (payload: CreateCountryPayload) => {
    try {
      setIsSubmitting(true);
      if (editingCountry) {
        await updateCountryRecord(editingCountry.id, payload);
        showToast(`Country profile for ${payload.name} updated.`);
      } else {
        await createCountryRecord(payload);
        showToast(`Country profile for ${payload.name} created successfully.`);
      }
      handleCloseForm();
      await loadData();
    } catch (err: unknown) {
      alert(`Save Error: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      await toggleCountryEnabled(id, enabled);
      showToast(`Route status updated.`);
      await loadData();
    } catch (err: unknown) {
      alert(`Toggle Error: ${getErrorMessage(err)}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCountryRecord(id);
      showToast("Country profile deleted.");
      await loadData();
    } catch (err: unknown) {
      alert(`Delete Error: ${getErrorMessage(err)}`);
    }
  };

  const handleExportCSV = () => {
    exportCountriesCSV(filteredCountries);
  };

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

      {/* 4 Metric Cards */}
      <CountryStatistics countries={countries} isLoading={isLoading} />

      {/* Main Countries Module Card */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              International Countries Manager Module
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Configure destination hubs, transit times, currencies, and customs regulatory clearance thresholds.
            </p>
          </div>

          <CountryActions
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenCreate={handleOpenCreate}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* Search & Filters Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
          <CountrySearch value={search} onChange={setSearch} />
          <CountryFilters
            statusFilter={statusFilter}
            currencyFilter={currencyFilter}
            onStatusChange={setStatusFilter}
            onCurrencyChange={setCurrencyFilter}
          />
        </div>

        {/* Content View: Table or Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <i className="fa-solid fa-spinner animate-spin text-2xl text-[#005DC3]"></i>
            <p className="text-xs font-bold">Loading country destinations dataset...</p>
          </div>
        ) : viewMode === "table" ? (
          <CountryTable
            countries={paginatedCountries}
            onEdit={handleOpenEdit}
            onToggleEnabled={handleToggleEnabled}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                onEdit={handleOpenEdit}
                onToggleEnabled={handleToggleEnabled}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/80 text-xs text-slate-400 font-medium">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, total)} of {total} countries
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

      {/* Country Form Modal */}
      {isFormOpen && (
        <CountryForm
          initialData={editingCountry}
          isSubmitting={isSubmitting}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
