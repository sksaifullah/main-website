"use client";

import React, { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

let toastListener: ((toast: { text: string; type: "success" | "error" }) => void) | null = null;

export const showToast = (text: string, type: "success" | "error" = "success") => {
  if (toastListener) {
    toastListener({ text, type });
  }
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = ({ text, type }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  return (
    <div
      id="toast-container"
      className="fixed top-6 right-6 z-[99999] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-6 py-3.5 rounded-xl text-white font-semibold shadow-2xl transition-all duration-300 animate-fade-in ${
            toast.type === "success" ? "bg-[#005DC3]" : "bg-red-600"
          }`}
        >
          <i
            className={`fa-solid ${
              toast.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"
            }`}
          />
          <span className="text-sm">{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
