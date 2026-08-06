"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface NotificationSettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [emailNotifs, setEmailNotifs] = useState(settings.email_notifications);
  const [smsNotifs, setSmsNotifs] = useState(settings.sms_notifications);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      email_notifications: emailNotifs,
      sms_notifications: smsNotifs,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">System &amp; Customer Notifications</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Configure automated email and SMS notification triggers for shipment status updates and quote alerts.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
          <div>
            <p className="font-bold text-white text-sm">Automated Email Notifications</p>
            <p className="text-[11px] text-slate-400">
              Send dispatch, transit, and delivery confirmation emails to shippers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
              emailNotifs ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
          <div>
            <p className="font-bold text-white text-sm">SMS &amp; WhatsApp Alerts</p>
            <p className="text-[11px] text-slate-400">
              Send instant SMS tracking updates to international destination phone numbers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSmsNotifs(!smsNotifs)}
            className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
              smsNotifs ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow"></span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Notification Preferences"}
        </button>
      </div>
    </form>
  );
};

export default NotificationSettings;
