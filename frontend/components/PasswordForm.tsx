"use client";

import React, { useState } from "react";

export const PasswordForm: React.FC = () => {
  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      alert("New passwords do not match!");
      return;
    }
    setMsg("Password changed successfully.");
    setCurr("");
    setNext("");
    setConfirm("");
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <h4 className="font-extrabold text-white text-sm">Security &amp; Password Update</h4>
        <p className="text-slate-400 text-xs mt-0.5">Ensure your account uses a strong password</p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl font-bold">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Current Password</label>
          <input
            type="password"
            value={curr}
            onChange={(e) => setCurr(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">New Password</label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-700">
        <button type="submit" className="btn-primary text-xs py-2 px-5 shadow-lg">
          Change Password
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
