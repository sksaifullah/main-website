"use client";

import React from "react";
import { ContactMessageItem } from "@/services/messages";
import StatusBadge from "./StatusBadge";

interface MessagesTableProps {
  messages: ContactMessageItem[];
  isLoading?: boolean;
  onView: (msg: ContactMessageItem) => void;
  onReply: (msg: ContactMessageItem) => void;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const MessagesTable: React.FC<MessagesTableProps> = ({
  messages,
  isLoading = false,
  onView,
  onReply,
  onArchive,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[900px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-700">
          <tr>
            <th className="p-3">Msg ID</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Email &amp; Phone</th>
            <th className="p-3">Subject &amp; Inquiry Preview</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 font-medium">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-32"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-44"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-5 bg-slate-800 rounded-full w-16"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-20 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : messages.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-envelope-open-text text-3xl text-slate-600 mb-2 block"></i>
                <p>No customer contact messages found.</p>
              </td>
            </tr>
          ) : (
            messages.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/60 transition">
                {/* ID */}
                <td className="p-3 font-mono font-bold text-slate-300">{m.id}</td>

                {/* Sender Name */}
                <td className="p-3 font-bold text-white">{m.name}</td>

                {/* Email & Phone */}
                <td className="p-3">
                  <div className="flex flex-col text-[11px]">
                    <span className="text-slate-200 font-mono">{m.email}</span>
                    {m.phone && <span className="text-slate-400 font-mono">{m.phone}</span>}
                  </div>
                </td>

                {/* Subject & Preview */}
                <td className="p-3 max-w-[260px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 truncate">
                      {m.subject || "General Inquiry"}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {m.message}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="p-3 font-mono text-[11px] text-slate-400">
                  {m.created_at}
                </td>

                {/* Status */}
                <td className="p-3">
                  <StatusBadge status={m.status} />
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(m)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="View Full Message"
                    >
                      <i className="fa-solid fa-eye text-xs"></i>
                    </button>
                    <button
                      onClick={() => onReply(m)}
                      className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 transition"
                      title="Send Reply"
                    >
                      <i className="fa-solid fa-reply text-xs"></i>
                    </button>
                    <button
                      onClick={() => onArchive(m.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
                      title="Archive Message"
                    >
                      <i className="fa-solid fa-box-archive text-xs"></i>
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition"
                      title="Delete Message"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;
