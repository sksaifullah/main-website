import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#005DC3]/20 border border-[#005DC3]/40 flex items-center justify-center text-[#005DC3] text-xl shadow-xl animate-bounce">
        <i className="fa-solid fa-plane-up"></i>
      </div>
      <p className="text-slate-300 font-extrabold text-xs tracking-wider uppercase animate-pulse">
        Sky Worldwide Express Loading...
      </p>
    </div>
  );
}
