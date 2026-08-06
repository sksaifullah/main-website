"use client";

import React, { useState } from "react";
import { CustomerRecord, CreateCustomerPayload, CustomerStatus } from "@/services/customer";

interface CustomerFormProps {
  initialData?: CustomerRecord | null;
  onSubmit: (data: CreateCustomerPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [country, setCountry] = useState(initialData?.country || "India");
  const [status, setStatus] = useState<CustomerStatus>(initialData?.status || "Active");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = "Customer Name is required.";
    }
    if (email && !email.includes("@")) {
      errs.email = "Invalid email format.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateCustomerPayload = {
      name: name.trim(),
      company: company.trim() || "Individual Customer",
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      country: country.trim() || "India",
      status,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Customer Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rajesh Kumar"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
          {errors.name && (
            <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Company / Organization
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Apex Global Traders"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98200 12345"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rajesh@apexglobal.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          >
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
            <option value="UAE">UAE</option>
            <option value="Australia">Australia</option>
            <option value="Canada">Canada</option>
            <option value="Germany">Germany</option>
            <option value="Singapore">Singapore</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Account Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatus)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          >
            <option value="Active">Active</option>
            <option value="VIP">VIP Account</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-slate-300 font-bold mb-1">
            Physical / Office Address
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address, City, Postal Code"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none resize-none"
          ></textarea>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-xs py-2 px-5 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i> Saving...
            </>
          ) : isEditing ? (
            "Update Customer Profile"
          ) : (
            "Add New Customer"
          )}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
