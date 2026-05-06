"use client";

import { useDeleteCustomer } from "@/hooks/useCustomerMutation";
import type { Customer } from "@/lib/api/customers";

type Props = {
  customer: Customer | null;
  onClose: () => void;
};

export function DeleteCustomerModal({ customer, onClose }: Props) {
  const { mutate, isPending } = useDeleteCustomer();

  if (!customer) return null;

  function handleDelete() {
    mutate(customer!.id, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0] text-2xl">
          🗑️
        </div>
        <h2 className="text-xl font-semibold text-[#202224]">Delete Customer</h2>
        <p className="mt-2 text-sm text-[#acacac]">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[#202224]">{customer.name}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#e0e0e0] py-2.5 text-sm font-medium text-[#7e7e7e] hover:bg-[#f5f6fa]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 rounded-xl bg-[#df0404] py-2.5 text-sm font-semibold text-white hover:bg-[#c00] disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}