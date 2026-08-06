export interface SystemSettingsData {
  company_name: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  logo_url?: string;
  support_email?: string;
  support_phone?: string;
  headquarters_address?: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  date_format?: string;
  language?: string;
  theme?: "dark" | "light" | "system";
  theme_mode?: "dark" | "light" | "system";
  email_notifications?: boolean;
  sms_notifications?: boolean;
  enable_email_notifications?: boolean;
  enable_sms_notifications?: boolean;
  enable_auto_tracking_sync?: boolean;
  auto_sync_carriers?: boolean;
  two_factor_auth?: boolean;
  api_key?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  sync_interval_minutes?: number;
  backup_frequency?: string;
  last_backup_date?: string;
}

export type SystemSettingsConfig = SystemSettingsData;
