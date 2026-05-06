"use client";

import { useState, useRef, useEffect } from "react";
import type { Customer } from "@/lib/api/customers";
import { useCustomersStore } from "@/store/customers.store";
import { usePermissions } from "@/hooks/usePermissions";

type Props = {
  customer: Customer;
};

export function RowActions({ customer }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setEditingCustomer, setDeletingCustomer } = useCustomersStore();
  const { canEdit, canDelete, canAssign } = usePermissions();

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!canEdit && !canDelete && !canAssign) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="grid h-8 w-8 place-items-center rounded-lg font-bold text-[#212121] hover:bg-[#f5f6fa] transition text-lg"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 rounded-2xl border border-[#f0f0f0] bg-white py-1 shadow-lg">
          {canEdit ? (
            <button
              type="button"
              onClick={() => { setEditingCustomer(customer); setOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#202224] hover:bg-[#f5f6fa]"
            >
              Edit
            </button>
          ) : null}
          {canAssign ? (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#202224] hover:bg-[#f5f6fa]"
            >
              Assign
            </button>
          ) : null}
          {canDelete ? (
            <>
              <div className="my-1 border-t border-[#f0f0f0]" />
              <button
                type="button"
                onClick={() => { setDeletingCustomer(customer); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#df0404] hover:bg-[#fff0f0]"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}