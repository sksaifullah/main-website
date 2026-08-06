import {
  UserProfileData,
  ActivityLogItem,
  UpdateProfilePayload,
  PasswordChangePayload,
} from "@/types";

export type {
  UserProfileData,
  ActivityLogItem,
  UpdateProfilePayload,
  PasswordChangePayload,
};

const PROFILE_STORAGE_KEY = "sky_worldwide_admin_profile_db";

const DEFAULT_PROFILE: UserProfileData = {
  id: "usr-admin-01",
  name: "Administrator",
  email: "admin@skyworldwide.express",
  phone: "+91 98200 99999",
  role: "Super Administrator",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  job_title: "Head of Logistics Operations",
  two_factor_enabled: false,
  activity_history: [
    { action: "Admin login from NYC IP", ip: "192.168.1.102", timestamp: "Today 14:30" },
    { action: "Updated FedEx Production Key", ip: "192.168.1.102", timestamp: "Yesterday 11:15" },
    { action: "Exported Customers CSV", ip: "192.168.1.105", timestamp: "25 Mar 2026" },
  ],
};

function getLocalProfile(): UserProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local profile:", e);
  }
  return DEFAULT_PROFILE;
}

function saveLocalProfile(data: UserProfileData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save local profile:", e);
  }
}

/**
 * Fetches user profile data.
 */
export async function getProfile(): Promise<UserProfileData> {
  return getLocalProfile();
}

/**
 * Updates profile fields.
 */
export async function updateProfile(payload: Partial<UserProfileData>): Promise<UserProfileData> {
  const current = getLocalProfile();
  const updated: UserProfileData = {
    ...current,
    ...payload,
  };
  saveLocalProfile(updated);
  return updated;
}

export const fetchUserProfile = getProfile;
export const updateUserProfile = updateProfile;
