"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [hasToken] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem("admin_token"));
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-lock text-3xl text-amber-400 animate-bounce"></i>
          <p className="font-bold text-sm">Protected Route — Redirecting to Login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-[#005DC3] selection:text-white">
      {/* Admin Sticky Header */}
      <Navbar variant="admin" />

      {/* Main Console Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Admin Console Footer */}
      <Footer />
    </div>
  );
}
