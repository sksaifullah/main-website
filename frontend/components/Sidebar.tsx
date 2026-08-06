"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: string;
}

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  setActiveTab?: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = "tracking", onTabChange }) => {
  const pathname = usePathname();

  const navItems: SidebarNavItem[] = [
    { id: "dashboard", label: "Dashboard Overview", icon: "fa-chart-pie", href: "/dashboard" },
    { id: "analytics", label: "Analytics & Reports", icon: "fa-chart-column", href: "/dashboard/analytics" },
    { id: "tracking", label: "Tracking Shipments", icon: "fa-location-crosshairs" },
    { id: "customers", label: "Customers Manager", icon: "fa-users", href: "/dashboard/customers" },
    { id: "services", label: "Services Shipments", icon: "fa-boxes-packing" },
    { id: "images", label: "Image Manager", icon: "fa-images" },
    { id: "countries", label: "Countries Manager", icon: "fa-globe", href: "/dashboard/countries" },
    { id: "pricing", label: "Pricing Manager", icon: "fa-tags", href: "/dashboard/pricing" },
    { id: "settings", label: "Settings & Location", icon: "fa-sliders", href: "/dashboard/settings" },
    { id: "quotes", label: "Messages & Quotes", icon: "fa-envelope", href: "/dashboard/messages" },
    { id: "integrations", label: "Courier Integrations", icon: "fa-plug-circle-bolt" },
    { id: "auditlogs", label: "Audit Logs", icon: "fa-clock-rotate-left" },
  ];

  return (
    <aside
      id="admin-sidebar"
      className="admin-sidebar w-full md:w-64 flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-3xl p-4 space-y-2 h-fit shadow-xl"
    >
      <div className="pb-3 border-b border-slate-800 mb-2 px-3 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Navigation Menu
        </p>
      </div>

      {navItems.map((item) => {
        const isActive = activeTab === item.id || (item.href && pathname === item.href);

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                isActive
                  ? "bg-[#005DC3] text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <i className={`fa-solid ${item.icon} text-base`}></i> {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onTabChange && onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
              isActive
                ? "bg-[#005DC3] text-white shadow-lg shadow-blue-900/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className={`fa-solid ${item.icon} text-base`}></i> {item.label}
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
