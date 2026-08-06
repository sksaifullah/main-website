"use client";

import React from "react";
import { ContactMessageItem } from "@/types";
import StatusBadge from "./StatusBadge";

interface MessageCardProps {
  message: ContactMessageItem;
  onView: (msg: ContactMessageItem) => void;
  onReply: (msg: ContactMessageItem) => void;
  onArchive: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onView,
  onReply,
  onArchive,
  onDelete,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-600 transition flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 font-bold text-xs">{message.id}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 font-bold text-[10px] border border-blue-800/60">
              Message
            </span>
          </div>
          <StatusBadge status={message.status} />
        </div>

        {/* Sender Info */}
        <div>
          <h4 className="font-extrabold text-white text-sm">{message.name}</h4>
          <p className="text-[11px] text-slate-400 font-mono">{message.email}</p>
        </div>

        {/* Message Subject & Content Snippet */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
          <p className="font-bold text-white truncate">{message.subject || "No Subject"}</p>
          <p className="text-[11px] text-slate-400 line-clamp-2">{message.message}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
        <span className="text-[10px] text-slate-400 font-mono">{message.created_at}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(message)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="View Details"
          >
            <i className="fa-solid fa-eye text-xs"></i>
          </button>
          <button
            onClick={() => onReply(message)}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 font-bold transition flex items-center gap-1 border border-blue-800/60 text-xs"
          >
            <i className="fa-solid fa-reply text-xs"></i> Reply
          </button>
          <button
            onClick={() => onArchive(message.id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
            title="Archive Inquiry"
          >
            <i className="fa-solid fa-box-archive text-xs"></i>
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition"
              title="Delete Inquiry"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
