"use client";

import React, { useEffect, useState, useCallback } from "react";
import StatusBadge from "@/components/StatusBadge";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import MessagesTable from "@/components/MessagesTable";
import QuoteTable from "@/components/QuoteTable";
import MessageCard from "@/components/MessageCard";
import QuoteCard from "@/components/QuoteCard";
import MessageDetails from "@/components/MessageDetails";
import QuoteDetails from "@/components/QuoteDetails";
import ReplyModal from "@/components/ReplyModal";
import StatisticsCard from "@/components/StatisticsCard";
import {
  ContactMessageItem,
  QuoteRequestItem,
  UnifiedInquiryItem as CommunicationItem,
  getMessagesAndQuotes,
  sendReply,
  archiveItem,
  deleteItem,
  exportCommunicationCSV,
  getErrorMessage,
} from "@/services/messages";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequestItem[]>([]);
  const [allItems, setAllItems] = useState<CommunicationItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab: "all" | "quote" | "message"
  const [activeTab, setActiveTab] = useState<"all" | "quote" | "message">("all");

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal States
  const [activeMessage, setActiveMessage] = useState<ContactMessageItem | null>(null);
  const [activeQuote, setActiveQuote] = useState<QuoteRequestItem | null>(null);
  const [replyItem, setReplyItem] = useState<CommunicationItem | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await getMessagesAndQuotes();
      setMessages(res.messages || []);
      setQuotes(res.quotes || []);
      setAllItems(res.items || res.all || []);
    } catch (err: unknown) {
      console.error("Failed to load inquiries:", err);
      setErrorMessage(getErrorMessage(err, "Failed to load inquiries dataset."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getMessagesAndQuotes()
      .then((res) => {
        if (isMounted) {
          setMessages(res.messages || []);
          setQuotes(res.quotes || []);
          setAllItems(res.items || res.all || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err, "Failed to load inquiries dataset."));
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

  // Filter items
  const filteredItems = allItems.filter((item) => {
    // Tab filter
    if (activeTab === "quote" && item.type !== "quote") return false;
    if (activeTab === "message" && item.type !== "message") return false;

    // Type filter dropdown
    if (typeFilter && item.type !== typeFilter) return false;

    // Status filter
    if (statusFilter && item.status !== statusFilter) return false;

    // Search query
    const s = search.toLowerCase().trim();
    if (!s) return true;

    const nameMatch = (item.name || "").toLowerCase().includes(s);
    const emailMatch = (item.email || "").toLowerCase().includes(s);
    const phoneMatch = (item.phone || "").toLowerCase().includes(s);
    const idMatch = (item.id || "").toLowerCase().includes(s);

    if (item.type === "quote") {
      const q = item as QuoteRequestItem;
      const originMatch = (q.origin_country || "").toLowerCase().includes(s);
      const destMatch = (q.destination_country || "").toLowerCase().includes(s);
      const serviceMatch = (q.service_type || "").toLowerCase().includes(s);
      return nameMatch || emailMatch || phoneMatch || idMatch || originMatch || destMatch || serviceMatch;
    } else {
      const m = item as ContactMessageItem;
      const subjectMatch = (m.subject || "").toLowerCase().includes(s);
      const messageMatch = (m.message || "").toLowerCase().includes(s);
      return nameMatch || emailMatch || phoneMatch || idMatch || subjectMatch || messageMatch;
    }
  });

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  // Handlers
  const handleSendReply = async (id: string, type: "message" | "quote", replyText: string) => {
    try {
      setIsSubmittingReply(true);
      await sendReply(id, type, replyText);
      showToast(`Reply sent successfully to customer (${id}).`);
      setReplyItem(null);
      await loadData();
    } catch (err: unknown) {
      alert(`Error sending reply: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleArchive = async (id: string, type: "message" | "quote") => {
    try {
      await archiveItem(id, type);
      showToast(`Inquiry (${id}) moved to archive.`);
      await loadData();
    } catch (err: unknown) {
      alert(`Archive Error: ${getErrorMessage(err)}`);
    }
  };

  const handleDelete = async (id: string, type: "message" | "quote") => {
    if (!confirm(`Are you sure you want to delete inquiry ${id}?`)) return;
    try {
      await deleteItem(id, type);
      showToast(`Inquiry (${id}) deleted.`);
      await loadData();
    } catch (err: unknown) {
      alert(`Delete Error: ${getErrorMessage(err)}`);
    }
  };

  const handleExportCSV = () => {
    exportCommunicationCSV(filteredItems);
  };

  // Metrics calculation
  const pendingQuotesCount = quotes.filter((q) => q.status === "Pending").length;
  const pendingMessagesCount = messages.filter((m) => m.status === "Pending").length;
  const totalInquiriesCount = allItems.length;
  const repliedCount = allItems.filter((i) => i.status === "Replied" || i.status === "Resolved").length;

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

      {/* 4 Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Total Inquiries"
          value={totalInquiriesCount}
          icon="fa-envelope-open-text"
          color="blue"
          trend="+12% this week"
        />
        <StatisticsCard
          title="Pending Quotes"
          value={pendingQuotesCount}
          icon="fa-calculator"
          color="amber"
          trend="Requires Response"
        />
        <StatisticsCard
          title="Pending Messages"
          value={pendingMessagesCount}
          icon="fa-circle-exclamation"
          color="purple"
          trend="Customer Support"
        />
        <StatisticsCard
          title="Replied / Resolved"
          value={repliedCount}
          icon="fa-circle-check"
          color="emerald"
          trend="96.4% Resolution"
        />
      </div>

      {/* Main Messages & Quotes Module Card */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Customer Messages &amp; Quote Requests Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Review inbound website contact inquiries, instant rate calculation quotes, and send email replies.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2"
          >
            <i className="fa-solid fa-file-export text-emerald-400"></i> Export Inquiries CSV
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-700/80 pb-3 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-[#005DC3] text-white shadow-lg"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <i className="fa-solid fa-list"></i> All Inquiries ({totalInquiriesCount})
          </button>
          <button
            onClick={() => {
              setActiveTab("quote");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "quote"
                ? "bg-[#005DC3] text-white shadow-lg"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <i className="fa-solid fa-calculator text-amber-400"></i> Quote Requests ({quotes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("message");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "message"
                ? "bg-[#005DC3] text-white shadow-lg"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <i className="fa-solid fa-comment-dots text-emerald-400"></i> Contact Messages ({messages.length})
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
          <Search value={search} onChange={setSearch} placeholder="Search by customer name, email, phone, country..." />
          <Filters
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Tables / Lists Container */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <i className="fa-solid fa-spinner animate-spin text-2xl text-[#005DC3]"></i>
            <p className="text-xs font-bold">Fetching communications dataset...</p>
          </div>
        ) : activeTab === "quote" ? (
          <>
            <div className="hidden lg:block">
              <QuoteTable
                quotes={paginatedItems as QuoteRequestItem[]}
                onView={(q) => setActiveQuote(q)}
                onReply={(q) => setReplyItem(q)}
                onArchive={(id) => handleArchive(id, "quote")}
                onDelete={(id) => handleDelete(id, "quote")}
              />
            </div>
            <div className="lg:hidden space-y-4">
              {(paginatedItems as QuoteRequestItem[]).map((q) => (
                <QuoteCard
                  key={q.id}
                  quote={q}
                  onView={() => setActiveQuote(q)}
                  onReply={() => setReplyItem(q)}
                  onArchive={() => handleArchive(q.id, "quote")}
                  onDelete={() => handleDelete(q.id, "quote")}
                />
              ))}
            </div>
          </>
        ) : activeTab === "message" ? (
          <>
            <div className="hidden lg:block">
              <MessagesTable
                messages={paginatedItems as ContactMessageItem[]}
                onView={(m) => setActiveMessage(m)}
                onReply={(m) => setReplyItem(m)}
                onArchive={(id) => handleArchive(id, "message")}
                onDelete={(id) => handleDelete(id, "message")}
              />
            </div>
            <div className="lg:hidden space-y-4">
              {(paginatedItems as ContactMessageItem[]).map((m) => (
                <MessageCard
                  key={m.id}
                  message={m}
                  onView={() => setActiveMessage(m)}
                  onReply={() => setReplyItem(m)}
                  onArchive={() => handleArchive(m.id, "message")}
                  onDelete={() => handleDelete(m.id, "message")}
                />
              ))}
            </div>
          </>
        ) : (
          /* Combined View */
          <div className="space-y-4">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-bold bg-slate-900/80">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Subject / Route</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {paginatedItems.map((item) => {
                    const isQuote = item.type === "quote";
                    const quote = item as QuoteRequestItem;
                    const msg = item as ContactMessageItem;

                    return (
                      <tr key={item.id} className="hover:bg-slate-700/40 transition">
                        <td className="py-3 px-4 font-extrabold text-slate-200">{item.id}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                              isQuote
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                                : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                        <td className="py-3 px-4 text-slate-300">
                          <div>{item.email}</div>
                          <div className="text-[11px] text-slate-400">{item.phone || "N/A"}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {isQuote ? (
                            <span>
                              {quote.origin_country} &rarr; {quote.destination_country} ({quote.weight_kg} kg)
                            </span>
                          ) : (
                            <span className="truncate max-w-[200px] block">
                              {msg.subject || msg.message}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {item.created_at}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                isQuote ? setActiveQuote(quote) : setActiveMessage(msg)
                              }
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                              title="View Details"
                            >
                              <i className="fa-solid fa-eye text-xs"></i>
                            </button>
                            <button
                              onClick={() => setReplyItem(item)}
                              className="p-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 transition"
                              title="Send Reply"
                            >
                              <i className="fa-solid fa-reply text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleArchive(item.id, item.type)}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition"
                              title="Archive"
                            >
                              <i className="fa-solid fa-box-archive text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.type)}
                              className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 transition"
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="lg:hidden space-y-4">
              {paginatedItems.map((item) =>
                item.type === "quote" ? (
                  <QuoteCard
                    key={item.id}
                    quote={item as QuoteRequestItem}
                    onView={() => setActiveQuote(item as QuoteRequestItem)}
                    onReply={() => setReplyItem(item)}
                    onArchive={() => handleArchive(item.id, "quote")}
                    onDelete={() => handleDelete(item.id, "quote")}
                  />
                ) : (
                  <MessageCard
                    key={item.id}
                    message={item as ContactMessageItem}
                    onView={() => setActiveMessage(item as ContactMessageItem)}
                    onReply={() => setReplyItem(item)}
                    onArchive={() => handleArchive(item.id, "message")}
                    onDelete={() => handleDelete(item.id, "message")}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/80 text-xs text-slate-400 font-medium">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, total)} of {total} inquiries
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

      {/* Message Details Modal */}
      {activeMessage && (
        <MessageDetails
          message={activeMessage}
          onClose={() => setActiveMessage(null)}
          onReply={() => {
            setReplyItem(activeMessage);
            setActiveMessage(null);
          }}
          onArchive={() => {
            handleArchive(activeMessage.id, "message");
            setActiveMessage(null);
          }}
        />
      )}

      {/* Quote Details Modal */}
      {activeQuote && (
        <QuoteDetails
          quote={activeQuote}
          onClose={() => setActiveQuote(null)}
          onReply={() => {
            setReplyItem(activeQuote);
            setActiveQuote(null);
          }}
          onArchive={() => {
            handleArchive(activeQuote.id, "quote");
            setActiveQuote(null);
          }}
        />
      )}

      {/* Reply Form Modal */}
      {replyItem && (
        <ReplyModal
          item={replyItem}
          isSubmitting={isSubmittingReply}
          onClose={() => setReplyItem(null)}
          onSend={(replyText) => handleSendReply(replyItem.id, replyItem.type, replyText)}
        />
      )}
    </div>
  );
}
