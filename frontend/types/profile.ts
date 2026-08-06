export interface ActivityLogItem {
  action: string;
  ip: string;
  timestamp: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar_url: string;
  job_title: string;
  two_factor_enabled: boolean;
  activity_history: ActivityLogItem[];
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  avatar_url?: string;
}

export interface PasswordChangePayload {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
