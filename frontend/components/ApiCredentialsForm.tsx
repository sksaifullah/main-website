"use client";

import React from "react";
import { CarrierCode, CarrierConfig } from "@/types";

interface ApiCredentialsFormProps {
  carrierCode: CarrierCode;
  config: CarrierConfig;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export const ApiCredentialsForm: React.FC<ApiCredentialsFormProps> = ({
  carrierCode,
  config,
  onChange,
  disabled = false,
}) => {
  if (carrierCode === "fedex") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            FedEx API Key / Client ID
          </label>
          <input
            type="text"
            value={config.client_id || ""}
            onChange={(e) => onChange("client_id", e.target.value)}
            disabled={disabled}
            placeholder="l7xx..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            FedEx Secret Key / Client Secret
          </label>
          <input
            type="password"
            value={config.client_secret || ""}
            onChange={(e) => onChange("client_secret", e.target.value)}
            disabled={disabled}
            placeholder="••••••••••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            FedEx Express Account Number
          </label>
          <input
            type="text"
            value={config.account_number || ""}
            onChange={(e) => onChange("account_number", e.target.value)}
            disabled={disabled}
            placeholder="510087654"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">Environment Mode</label>
          <select
            value={config.mode || "sandbox"}
            onChange={(e) => onChange("mode", e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="sandbox">Sandbox (Development / Test)</option>
            <option value="production">Production (Live FedEx Endpoint)</option>
          </select>
        </div>
      </div>
    );
  }

  if (carrierCode === "dhl") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">DHL Express API Key</label>
          <input
            type="text"
            value={config.api_key || ""}
            onChange={(e) => onChange("api_key", e.target.value)}
            disabled={disabled}
            placeholder="dhl_express_api_key_..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">DHL API Secret</label>
          <input
            type="password"
            value={config.api_secret || ""}
            onChange={(e) => onChange("api_secret", e.target.value)}
            disabled={disabled}
            placeholder="••••••••••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            DHL Shipper Account Number
          </label>
          <input
            type="text"
            value={config.account_number || ""}
            onChange={(e) => onChange("account_number", e.target.value)}
            disabled={disabled}
            placeholder="965412890"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
      </div>
    );
  }

  if (carrierCode === "ups") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            UPS OAuth Client ID
          </label>
          <input
            type="text"
            value={config.client_id || ""}
            onChange={(e) => onChange("client_id", e.target.value)}
            disabled={disabled}
            placeholder="ups_client_id_..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            UPS OAuth Client Secret
          </label>
          <input
            type="password"
            value={config.client_secret || ""}
            onChange={(e) => onChange("client_secret", e.target.value)}
            disabled={disabled}
            placeholder="••••••••••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            UPS Shipper Account Number
          </label>
          <input
            type="text"
            value={config.account_number || ""}
            onChange={(e) => onChange("account_number", e.target.value)}
            disabled={disabled}
            placeholder="A1B2C3"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
      </div>
    );
  }

  if (carrierCode === "aramex") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Aramex Username / Email
          </label>
          <input
            type="text"
            value={config.username || ""}
            onChange={(e) => onChange("username", e.target.value)}
            disabled={disabled}
            placeholder="aramex_user@skyworldwide.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">Aramex Password</label>
          <input
            type="password"
            value={config.password || ""}
            onChange={(e) => onChange("password", e.target.value)}
            disabled={disabled}
            placeholder="••••••••••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">Account Number</label>
          <input
            type="text"
            value={config.account_number || ""}
            onChange={(e) => onChange("account_number", e.target.value)}
            disabled={disabled}
            placeholder="200148"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1">Account PIN</label>
          <input
            type="text"
            value={config.account_pin || ""}
            onChange={(e) => onChange("account_pin", e.target.value)}
            disabled={disabled}
            placeholder="3321"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default ApiCredentialsForm;
