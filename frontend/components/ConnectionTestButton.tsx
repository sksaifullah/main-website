"use client";

import React, { useState } from "react";
import { CarrierCode, getErrorMessage } from "@/types";

interface ConnectionTestButtonProps {
  carrierCode: CarrierCode;
  carrierName: string;
  onTest: (code: CarrierCode) => Promise<{ success: boolean; message: string }>;
  disabled?: boolean;
}

export const ConnectionTestButton: React.FC<ConnectionTestButtonProps> = ({
  carrierCode,
  carrierName,
  onTest,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const handleTestClick = async () => {
    try {
      setIsLoading(true);
      setResultMessage(null);
      const res = await onTest(carrierCode);
      setResultMessage({
        success: res.success,
        text: res.message,
      });
    } catch (err: unknown) {
      setResultMessage({
        success: false,
        text: getErrorMessage(err, `Failed to verify ${carrierName} connection.`),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleTestClick}
        disabled={isLoading || disabled}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700/80 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin text-blue-400"></i>
            Authenticating API Token...
          </>
        ) : (
          <>
            <i className="fa-solid fa-plug-circle-bolt text-emerald-400"></i>
            Test Live API Connection
          </>
        )}
      </button>

      {/* Result Message Display */}
      {resultMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 animate-fadeIn ${
            resultMessage.success
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
              : "bg-red-950/60 border-red-800 text-red-200"
          }`}
        >
          <i
            className={`fa-solid ${
              resultMessage.success ? "fa-circle-check" : "fa-triangle-exclamation"
            } mt-0.5 text-sm shrink-0`}
          ></i>
          <div className="break-words">
            <p className="font-bold">
              {resultMessage.success ? "Connection Verified" : "Authentication Error"}
            </p>
            <p className="text-[11px] opacity-90 mt-0.5">{resultMessage.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTestButton;
