import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-[#005DC3] text-4xl shadow-2xl">
        <i className="fa-solid fa-compass"></i>
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          The international logistics route or admin module page you requested does not exist or has been relocated.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="btn-primary text-xs py-2.5 px-5 shadow-lg flex items-center gap-2"
        >
          <i className="fa-solid fa-house"></i> Home Page
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
        >
          Admin Console
        </Link>
      </div>
    </div>
  );
}
