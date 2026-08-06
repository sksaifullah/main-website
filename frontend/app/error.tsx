"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 text-3xl shadow-2xl">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-extrabold tracking-tight">Something went wrong!</h2>
        <p className="text-slate-400 text-xs leading-relaxed font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
          {error.message || "An unexpected application error occurred."}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2"
      >
        <i className="fa-solid fa-arrows-rotate"></i> Try Again
      </button>
    </div>
  );
}
