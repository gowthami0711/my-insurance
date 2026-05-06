"use client";

import { useState, useEffect } from "react";
import type { Customer } from "@/lib/api/customers";
import { useUpdateCustomer } from "@/hooks/useCustomerMutation";

type Props = {
  customer: Customer | null;
  onClose: () => void;
};

export function EditCustomerModal({ customer, onClose }: Props) {
  const [form, setForm] = useState<Partial<Customer>>({});
  const { mutate, isPending } = useUpdateCustomer();

  useEffect(() => {
    if (customer) setForm(customer);
  }, [customer]);

  if (!customer) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { id: customer!.id, data: form },
      { onSuccess: onClose }
    );
  }

  const fields: { key: keyof Customer; label: string }[] = [
    { key: "name", label: "Customer Name" },
    { key: "company", label: "Company" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "country", label: "Country" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#202224]">Edit Customer</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#9197b3] hover:bg-[#f5f6fa]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-[#acacac]">
                {label}
              </label>
              <input
                type="text"
                value={(form[key] as string) ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-4 py-2.5 text-sm outline-none focus:border-[#5932ea] transition"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-xs font-medium text-[#acacac]">Status</label>
            <select
              value={form.status ?? "Active"}
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
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}