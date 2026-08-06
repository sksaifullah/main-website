"use client";

import React from "react";
import { ContactMessageItem } from "@/services/messages";
import StatusBadge from "./StatusBadge";

interface MessageDetailsProps {
  isOpen?: boolean;
  message: ContactMessageItem | null;
  onClose: () => void;
  onOpenReply?: (msg: ContactMessageItem) => void;
  onReply?: () => void;
  onArchive?: () => void;
}

export const MessageDetails: React.FC<MessageDetailsProps> = ({
  isOpen = true,
  message,
  onClose,
  onOpenReply,
  onReply,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-envelope-open text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Contact Message ({message.id})
                </h3>
                <StatusBadge status={message.status} />
              </div>
              <p className="text-[11px] text-slate-400">Received on {message.created_at}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {/* Sender Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Sender Name
              </span>
              <p className="font-bold text-white text-sm mt-0.5">{message.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Email Address
              </span>
              <p className="font-bold text-slate-200 mt-0.5 font-mono">{message.email}</p>
            </div>
            {message.phone && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Phone Number
                </span>
                <p className="font-bold text-slate-200 mt-0.5 font-mono">{message.phone}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Subject
              </span>
              <p className="font-bold text-slate-200 mt-0.5">
                {message.subject || "General Inquiry"}
              </p>
            </div>
          </div>

          {/* Inquiry Message Text */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-bold uppercase text-[10px]">
              Customer Message Text
            </label>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-normal text-xs leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          {/* Reply History */}
          {message.reply && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <i className="fa-solid fa-reply text-xs"></i> Reply Sent on {message.replied_at}
              </label>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200 font-normal text-xs leading-relaxed">
                {message.reply}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenReply) onOpenReply(message);
              if (onReply) onReply();
            }}
            className="btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2"
          >
            <i className="fa-solid fa-reply"></i> Send Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetails;
