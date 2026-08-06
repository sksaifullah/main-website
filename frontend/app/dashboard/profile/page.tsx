"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import ProfileForm from "@/components/ProfileForm";
import PasswordForm from "@/components/PasswordForm";
import AccountSettings from "@/components/AccountSettings";
import { UserProfileData, fetchUserProfile, updateUserProfile } from "@/services/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchUserProfile()
      .then((res) => {
        if (isMounted) {
          setProfile(res);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error("Failed to load profile:", e);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (partial: Partial<UserProfileData>) => {
    const updated = await updateUserProfile(partial);
    setProfile(updated);
    showToast("Profile details saved successfully.");
  };

  if (isLoading || !profile) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3 animate-pulse">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-[#005DC3]"></i>
        <p className="text-xs font-bold">Loading User Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-800 p-3.5 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Top Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Admin User Profile &amp; Account Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Manage administrator account information, avatar image, security password, and activity logs.
        </p>
      </div>

      {/* Profile Overview Card */}
      <ProfileCard profile={profile} />

      {/* Profile Editing Cards */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-8">
        <ProfileForm profile={profile} onSave={handleSave} />
        <hr className="border-slate-700/60" />
        <PasswordForm />
        <hr className="border-slate-700/60" />
        <AccountSettings profile={profile} onSave={handleSave} />
      </div>
    </div>
  );
}
