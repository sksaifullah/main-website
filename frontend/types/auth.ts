export interface AdminUser {
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AdminUser;
  detail?: string;
}
