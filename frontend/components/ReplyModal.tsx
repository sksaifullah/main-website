"use client";

import React, { useState } from "react";
import { UnifiedInquiryItem, QuoteRequestItem, ContactMessageItem } from "@/types";

interface ReplyModalProps {
  isOpen?: boolean;
  item: UnifiedInquiryItem | null;
  onClose: () => void;
  onSendReply?: (id: string, type: "message" | "quote", replyText: string) => Promise<void>;
  onSend?: (replyText: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen = true,
  item,
  onClose,
  onSendReply,
  onSend,
  isSubmitting = false,
}) => {
  const [replyText, setReplyText] = useState("");

  if (!isOpen || !item) return null;

  const isQuote = item.type === "quote";
  const quoteItem = isQuote ? (item as QuoteRequestItem) : null;
  const msgItem = !isQuote ? (item as ContactMessageItem) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onSend) {
      await onSend(replyText.trim());
    } else if (onSendReply) {
      await onSendReply(item.id, item.type, replyText.trim());
    }
    setReplyText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden space-y-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-950/80 text-blue-400 flex items-center justify-center text-lg border border-blue-800/80">
              <i className="fa-solid fa-reply"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Reply to {item.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">{item.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Info Box */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-slate-300">
            {isQuote && quoteItem ? (
              <p>
                <span className="font-bold text-white">Quote Request:</span> Route from{" "}
                <span className="text-emerald-400">{quoteItem.origin_country}</span> to{" "}
                <span className="text-emerald-400">{quoteItem.destination_country}</span> (
                {quoteItem.weight_kg} kg)
              </p>
            ) : (
              <p>
                <span className="font-bold text-white">Subject:</span>{" "}
                {msgItem?.subject || "Contact Inquiry"}
              </p>
            )}
          </div>

          {/* Response Textarea */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">
              Response Message / Official Quote Details <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your official response, pricing quote, or instructions here..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 text-white font-medium focus:border-[#005DC3] outline-none leading-relaxed"
              required
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="btn-primary px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i> Send Official Response
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;
