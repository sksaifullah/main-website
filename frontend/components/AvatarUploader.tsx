"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface AvatarUploaderProps {
  avatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onAvatarChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const src = avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Image
        src={src}
        alt="Avatar"
        width={64}
        height={64}
        unoptimized
        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#005DC3] shadow-lg shrink-0"
      />
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
        >
          <i className="fa-solid fa-camera text-blue-400"></i> Change Avatar
        </button>
        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP (Max 2MB)</p>
      </div>
    </div>
  );
};

export default AvatarUploader;
