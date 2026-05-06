"use client";

import { useState } from "react";
import type { Customer } from "@/lib/api/customers";
import { useCreateCustomer } from "@/hooks/useCustomerMutation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EMPTY_FORM = {
  name: "",
  company: "",
  phone: "",
  email: "",
  country: "",
  status: "Active" as Customer["status"],
};

export function AddCustomerModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { mutate, isPending } = useCreateCustomer();

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
        onClose();
      },
    });
  }

  const fields: { key: keyof typeof EMPTY_FORM; label: string; type?: string }[] = [
    { key: "name", label: "Customer Name" },
    { key: "company", label: "Company" },
    { key: "phone", label: "Phone Number", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "country", label: "Country" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#202224]">Add Customer</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#9197b3] hover:bg-[#f5f6fa]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type = "text" }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-[#acacac]">
                {label}
              </label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-4 py-2.5 text-sm outline-none focus:border-[#5932ea] transition"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-xs font-medium text-[#acacac]">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Customer["status"] }))}
              className="w-full rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-4 py-2.5 text-sm outline-none focus:border-[#5932ea] transition"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#e0e0e0] py-2.5 text-sm font-medium text-[#7e7e7e] hover:bg-[#f5f6fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-[#5932ea] py-2.5 text-sm font-semibold text-white hover:bg-[#4a28d1] disabled:opacity-60"
            >
              {isPending ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}