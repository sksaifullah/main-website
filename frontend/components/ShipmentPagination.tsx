"use client";

import React from "react";

interface ShipmentPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const ShipmentPagination: React.FC<ShipmentPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
      {/* Range Display */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-white">{startItem}</span> -{" "}
          <span className="font-bold text-white">{endItem}</span> of{" "}
          <span className="font-bold text-white">{totalItems}</span> shipments
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-semibold outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Pagination Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center gap-1 border border-slate-700"
        >
          <i className="fa-solid fa-chevron-left text-[10px]"></i> Prev
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
          let pageNum = index + 1;
          if (totalPages > 5 && currentPage > 3) {
            pageNum = currentPage - 2 + index;
            if (pageNum > totalPages) {
              pageNum = totalPages - (4 - index);
            }
          }
          if (pageNum <= 0) return null;

          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition border ${
                isActive
                  ? "bg-[#005DC3] text-white border-blue-500 shadow-md"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center gap-1 border border-slate-700"
        >
          Next <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

export default ShipmentPagination;
