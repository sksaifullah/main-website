import apiClient from "@/lib/apiClient";
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

/**
 * Fetches admin profile data from the backend.
 */
export async function fetchUserProfile(): Promise<UserProfileData> {
  const res = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
    "/api/admin/profile",
    { params: { _t: Date.now() } }
  );
  const d = res.data?.data || {};
  return {
    id: "admin-01",
    name: String(d.full_name || d.username || "Admin"),
    email: String(d.email || ""),
    phone: String(d.phone || ""),
    role: String(d.role || "superadmin"),
    avatar_url: String(d.avatar || ""),
    job_title: String(d.bio || "Sky Worldwide Operations Administrator"),
    two_factor_enabled: false,
    activity_history: [],
  };
}

export const getProfile = fetchUserProfile;

/**
 * Updates admin profile fields on the backend.
 */
export async function updateUserProfile(
  payload: Partial<UserProfileData>
): Promise<UserProfileData> {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.full_name = payload.name;
  if (payload.phone !== undefined) body.phone = payload.phone;
  if (payload.job_title !== undefined) body.bio = payload.job_title;
  if (payload.avatar_url !== undefined) body.avatar = payload.avatar_url;

  await apiClient.put("/api/admin/profile", body);
  return fetchUserProfile();
}

export const updateProfile = updateUserProfile;
