"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post<{
        success: boolean;
        token?: string;
        user?: { username: string };
        message?: string;
      }>(`${API_BASE}/api/admin/login`, {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data?.success) {
        const token = response.data?.token || "sky-admin-jwt-token-778899";
        const user = response.data?.user?.username || username;

        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_username", user);

        router.push("/dashboard");
      } else {
        setErrorMessage(response.data?.message || "Invalid credentials.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const detail = getErrorMessage(err, "Network error. Failed to connect to authentication server.");
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-[#005DC3] selection:text-white">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <Image
            src="/images/logo1.PNG"
            alt="SKY WORLDWIDE"
            width={180}
            height={48}
            className="h-12 w-auto bg-white p-2.5 rounded-2xl mx-auto object-contain shadow-lg"
          />
          <h1 className="text-xl font-extrabold tracking-tight mt-3">
            Admin Console Authentication
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access Sky Worldwide Operations Panel
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-800 p-3 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
            <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Admin Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Admin or admin@skyworldwide.com"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Master Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-3.5 pr-10 py-2.5 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-xs font-bold shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i> Authenticating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i> Enter Console
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 font-medium">
          Protected Sky Worldwide System — Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
