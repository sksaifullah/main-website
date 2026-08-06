"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface UserMenuProps {
  name?: string;
  email?: string;
  role?: string;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  name = "Administrator",
  email = "admin@skyworldwide.express",
  role = "Superadmin",
  onLogout,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_username");
      localStorage.removeItem("admin_credentials");
    }
    if (onLogout) {
      onLogout();
    } else {
      router.push("/admin/login");
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* User Info Display */}
      <div className="text-right hidden sm:block">
        <p className="text-xs font-bold text-white">{name}</p>
        <p className="text-[11px] text-slate-400">{email}</p>
      </div>

      {/* User Avatar Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition border border-slate-700/60"
      >
        <div className="w-7 h-7 rounded-lg bg-[#005DC3] text-white font-extrabold text-xs flex items-center justify-center shadow">
          {name.charAt(0)}
        </div>
        <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 mr-1 hidden sm:inline"></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs py-2 animate-fadeIn">
          <div className="px-4 py-2 border-b border-slate-800">
            <p className="font-bold text-white">{name}</p>
            <p className="text-[11px] text-slate-400">{email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 text-[9px] font-extrabold uppercase">
              {role}
            </span>
          </div>

          <div className="py-1 border-b border-slate-800">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold"
            >
              <i className="fa-solid fa-user-gear text-xs text-blue-400"></i> My Profile
            </Link>
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold"
            >
              <i className="fa-solid fa-bell text-xs text-amber-400"></i> Notifications
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold"
            >
              <i className="fa-solid fa-sliders text-xs text-purple-400"></i> System Settings
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-950/40 transition font-bold flex items-center gap-2"
          >
            <i className="fa-solid fa-power-off text-xs"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
