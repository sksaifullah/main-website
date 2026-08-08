"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomerStatistics from "@/components/CustomerStatistics";
import CustomerSearch from "@/components/CustomerSearch";
import CustomerFilters from "@/components/CustomerFilters";
import CustomerPagination from "@/components/CustomerPagination";
import CustomerActions from "@/components/CustomerActions";
import CustomerTable from "@/components/CustomerTable";
import CustomerDetailsModal, { CustomerModalMode } from "@/components/CustomerDetailsModal";
import {
  CustomerRecord,
  CreateCustomerPayload,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomers,
  exportCustomersCSV,
  importCustomersFromJSON,
  getErrorMessage,
} from "@/services/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [modalMode, setModalMode] = useState<CustomerModalMode>(null);
  const [activeCustomer, setActiveCustomer] = useState<CustomerRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch (err: unknown) {
      console.error("Failed to load customers:", err);
      setErrorMessage(getErrorMessage(err, "Failed to load customers dataset."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getCustomers()
      .then((data) => {
        if (isMounted) {
          setCustomers(data.customers || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to load customers dataset."));
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

  // Filter customers
  const filteredCustomers = customers.filter((item) => {
    const s = search.toLowerCase().trim();
    const nameMatch = (item.name || "").toLowerCase().includes(s);
    const companyMatch = (item.company || "").toLowerCase().includes(s);
    const emailMatch = (item.email || "").toLowerCase().includes(s);
    const phoneMatch = (item.phone || "").toLowerCase().includes(s);
    const countryMatchText = (item.country || "").toLowerCase().includes(s);

    const searchPass =
      !s || nameMatch || companyMatch || emailMatch || phoneMatch || countryMatchText;

    const statusPass = !status || item.status === status;
    const countryPass = !country || item.country === country;

    return searchPass && statusPass && countryPass;
  });

  const total = filteredCustomers.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

  // Selection Handlers
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const paginatedIds = paginatedCustomers.map((c) => c.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...paginatedIds])));
    } else {
      const paginatedSet = new Set(paginatedCustomers.map((c) => c.id));
      setSelectedIds(selectedIds.filter((id) => !paginatedSet.has(id)));
    }
  };

  const handleSelectRow = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setActiveCustomer(null);
    setModalMode("create");
  };

  const handleOpenEditModal = (c: CustomerRecord) => {
    setActiveCustomer(c);
    setModalMode("edit");
  };

  const handleOpenViewModal = (c: CustomerRecord) => {
    setActiveCustomer(c);
    setModalMode("view");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setActiveCustomer(null);
  };

  const handleFormSubmit = async (payload: CreateCustomerPayload) => {
    try {
      setIsSubmitting(true);
      if (modalMode === "edit" && activeCustomer) {
        await updateCustomer(activeCustomer.id, payload);
        showToast(`Customer profile for ${payload.name} updated.`);
      } else {
        await createCustomer(payload);
        showToast(`Customer profile for ${payload.name} created successfully.`);
      }
      handleCloseModal();
      await loadData();
    } catch (err: unknown) {
      alert(`Error saving customer: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomer(id);
      showToast("Customer profile deleted successfully.");
      await loadData();
    } catch (err: unknown) {
      alert(`Error deleting customer: ${getErrorMessage(err)}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected customer(s)?`)) {
      return;
    }
    try {
      const deletedCount = await bulkDeleteCustomers(selectedIds);
      setSelectedIds([]);
      showToast(`Successfully deleted ${deletedCount} customer profile(s).`);
      await loadData();
    } catch (err: unknown) {
      alert(`Bulk Delete Error: ${getErrorMessage(err)}`);
    }
  };

  const handleExportCSV = () => {
    exportCustomersCSV(filteredCustomers);
  };

  const handleImportJSON = async (jsonArray: Record<string, unknown>[]) => {
    const count = await importCustomersFromJSON(jsonArray);
    if (count > 0) {
      showToast(`Imported ${count} customer record(s) successfully.`);
      await loadData();
    } else {
      alert("No valid customer records found in file.");
    }
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
      <CustomerStatistics customers={customers} isLoading={isLoading} />

      {/* Main Customers Module Card */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Customer Relationship Management (CRM)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Manage corporate accounts, individual shippers, order history, and VIP status tiers.
            </p>
          </div>

          <CustomerActions
            selectedCount={selectedIds.length}
            onOpenCreate={handleOpenCreateModal}
            onBulkDelete={handleBulkDelete}
            onExportCSV={handleExportCSV}
            onImportJSON={handleImportJSON}
          />
        </div>

        {/* Search & Filters Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
          <CustomerSearch value={search} onChange={setSearch} />
          <CustomerFilters
            status={status}
            country={country}
            onStatusChange={setStatus}
            onCountryChange={setCountry}
          />
        </div>

        {/* Customer Table */}
        <CustomerTable
          customers={paginatedCustomers}
          selectedIds={selectedIds}
          isLoading={isLoading}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onView={handleOpenViewModal}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCustomer}
        />

        {/* Pagination Bar */}
        <CustomerPagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Customer Modal (Create / Edit / View) */}
      {modalMode && (
        <CustomerDetailsModal
          mode={modalMode}
          customer={activeCustomer}
          isSubmitting={isSubmitting}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
