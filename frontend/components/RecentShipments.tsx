"use client";

import React, { useState } from "react";
import { ShipmentDetailsData } from "@/types/tracking";
import ShipmentTable from "./ShipmentTable";
import ShipmentSearch from "./ShipmentSearch";
import ShipmentFilters from "./ShipmentFilters";
import ShipmentPagination from "./ShipmentPagination";
import ShipmentActions from "./ShipmentActions";

interface RecentShipmentsProps {
  shipments: ShipmentDetailsData[];
  isLoading?: boolean;
  onNewShipment?: () => void;
  onViewShipment?: (shipment: ShipmentDetailsData) => void;
  onEditShipment?: (shipment: ShipmentDetailsData) => void;
  onSyncShipment?: (trackingId: string) => Promise<void>;
  onDeleteShipment?: (trackingId: string) => Promise<void>;
  onOpenCreate?: () => void;
  onView?: (shipment: ShipmentDetailsData) => void;
  onEdit?: (shipment: ShipmentDetailsData) => void;
  onSync?: (trackingId: string) => Promise<void>;
  onDelete?: (trackingId: string) => Promise<void>;
  onSyncAllCarriers?: () => Promise<void>;
  onExportCSV?: () => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkStatusUpdate?: (ids: string[], status: string) => Promise<void>;
}

export const RecentShipments: React.FC<RecentShipmentsProps> = ({
  shipments,
  isLoading = false,
  onNewShipment,
  onViewShipment,
  onEditShipment,
  onSyncShipment,
  onDeleteShipment,
  onOpenCreate,
  onView,
  onEdit,
  onSync,
  onDelete,
  onSyncAllCarriers,
  onExportCSV,
  onBulkDelete,
  onBulkStatusUpdate,
}) => {
  const handleCreate = onOpenCreate || onNewShipment || (() => {});
  const handleView = onView || onViewShipment || (() => {});
  const handleEdit = onEdit || onEditShipment || (() => {});
  const handleSync = onSync || onSyncShipment || (async () => {});
  const handleDelete = onDelete || onDeleteShipment || (async () => {});
  const handleExport = onExportCSV || (() => {});

  const [search, setSearch] = useState("");
  const [partnerCourier, setPartnerCourier] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Filter shipments
  const filtered = shipments.filter((item) => {
    const trNum = (
      item.partner_tracking_number ||
      item.tracking_number ||
      ""
    ).toLowerCase();
    const idMatch = trNum.includes(search.toLowerCase().trim());
    const nameMatch = (item.customer_name || item.sender_name || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const receiverMatch = (item.receiver_name || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const searchPass = !search || idMatch || nameMatch || receiverMatch;

    const pCourier = (item.partner_courier || "").toLowerCase();
    const courierPass =
      !partnerCourier || pCourier.includes(partnerCourier.toLowerCase());

    const st = (item.status || "").toLowerCase();
    const statusPass = !status || st.includes(status.toLowerCase());

    return searchPass && courierPass && statusPass;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedShipments = filtered.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allPaginatedIds = paginatedShipments.map(
        (s) => s.partner_tracking_number || s.tracking_number || ""
      );
      setSelectedIds(Array.from(new Set([...selectedIds, ...allPaginatedIds])));
    } else {
      const paginatedSet = new Set(
        paginatedShipments.map(
          (s) => s.partner_tracking_number || s.tracking_number || ""
        )
      );
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

  const handleSyncAll = async () => {
    try {
      setIsSyncingAll(true);
      if (onSyncAllCarriers) await onSyncAllCarriers();
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleBulkDeleteAction = async () => {
    if (onBulkDelete && selectedIds.length > 0) {
      await onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkStatusAction = async (newStatus: string) => {
    if (onBulkStatusUpdate && selectedIds.length > 0) {
      await onBulkStatusUpdate(selectedIds, newStatus);
      setSelectedIds([]);
    }
  };

  return (
    <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Enterprise Shipment Management Module
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Manage official partner courier tracking numbers (DHL, FedEx, UPS, Aramex) &amp; live carrier sync.
          </p>
        </div>
        <ShipmentActions
          onNewShipment={handleCreate}
          onSyncAllCarriers={handleSyncAll}
          onExportCSV={handleExport}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDeleteAction}
          onBulkStatusUpdate={handleBulkStatusAction}
          isSyncingAll={isSyncingAll}
        />
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 pb-2 border-t border-b border-slate-700/60">
        <div className="md:col-span-1">
          <ShipmentSearch value={search} onChange={setSearch} />
        </div>
        <div className="md:col-span-2">
          <ShipmentFilters
            partnerCourier={partnerCourier}
            onPartnerCourierChange={setPartnerCourier}
            status={status}
            onStatusChange={setStatus}
            onReset={() => {
              setSearch("");
              setPartnerCourier("");
              setStatus("");
            }}
          />
        </div>
      </div>

      {/* Table */}
      <ShipmentTable
        shipments={paginatedShipments}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={handleView}
        onEdit={handleEdit}
        onSync={handleSync}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <ShipmentPagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />
    </div>
  );
};

export default RecentShipments;
