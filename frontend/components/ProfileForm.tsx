"use client";

import React, { useState } from "react";
import { UserProfileData } from "@/services/profile";
import AvatarUploader from "./AvatarUploader";

interface ProfileFormProps {
  profile: UserProfileData;
  onSave: (partial: Partial<UserProfileData>) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [jobTitle, setJobTitle] = useState(profile.job_title);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      name,
      email,
      phone,
      job_title: jobTitle,
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h4 className="font-extrabold text-white text-sm">Personal Information &amp; Contact</h4>
        <p className="text-slate-400 text-xs mt-0.5">Update profile avatar, full name, and phone</p>
      </div>

      <AvatarUploader avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#005DC3] outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile Details"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
