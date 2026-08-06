"use client";

import React from "react";
import Image from "next/image";
import { UserProfileData } from "@/types";

interface ProfileCardProps {
  profile: UserProfileData;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
      <Image
        src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
        alt={profile.name}
        width={96}
        height={96}
        unoptimized
        className="w-24 h-24 rounded-3xl object-cover border-4 border-[#005DC3] shadow-2xl shrink-0"
      />
      <div className="space-y-1.5 flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h3 className="font-extrabold text-white text-lg">{profile.name}</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 font-extrabold text-[10px] border border-purple-800/60">
            {profile.role}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium">{profile.job_title}</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
          <span>
            <i className="fa-solid fa-envelope text-blue-400 mr-1"></i> {profile.email}
          </span>
          <span>
            <i className="fa-solid fa-phone text-emerald-400 mr-1"></i> {profile.phone}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
