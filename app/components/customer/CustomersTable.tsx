"use client";

import { useCustomers } from "@/hooks/useCustomers";
import { useCustomersStore } from "@/store/customers.store";
import { usePermissions } from "@/hooks/usePermissions";
import { AddCustomerModal } from "./AddCustomerModal";
import { EditCustomerModal } from "./EditCustomerModal";
import { DeleteCustomerModal } from "./DeleteCustomerModal";
import { RowActions } from "./RowActions";
import { useWorkspaceStore } from "@/store/workspace.store";
import Image from "next/image";

export function CustomersTable() {
  const { data, isLoading, isError } = useCustomers();
  const {
    search, page, sortBy, isAddingCustomer,
    editingCustomer, deletingCustomer,
    setSearch, setPage, setSortBy,
    setIsAddingCustomer,
    setEditingCustomer, setDeletingCustomer,
  } = useCustomersStore();

  const { canEdit, canDelete, canAssign } = usePermissions();

  const { openWorkspace } = useWorkspaceStore();

  const hasActions = canEdit || canDelete || canAssign;

  if (isError) return <p className="p-6 text-red-500">Something went wrong.</p>;

  function getPaginationRange(current: number, total: number) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-semibold">All Customers</h2>
          <p className="text-sm text-[#16c098]">Active Members</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl bg-[#f9fbff] px-3 py-2">
            <Image src="/images/search.svg" alt="Search Customers" width={24} height={24} />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 w-32 bg-transparent text-sm outline-none placeholder:text-[#b5b7c0]"
            />
          </div>
          <div className="relative appearance-none rounded-xl bg-[#f9fbff] border border-[#eeeeee] pl-3 pr-8 py-2 text-sm text-[#7e7e7e]  ">
          Sort by : <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "name" | "company")}
              className="cursor-pointer outline-none text-[#3D3C42] font-bold"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="company">Company</option>
            </select>
           
          </div>
          {canEdit ? (
            <div className="flex justify-end p-4 pb-0">
              <button
                type="button"
                onClick={() => setIsAddingCustomer(true)}
                className="rounded-xl bg-[#5932ea] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a28d1] transition"
              >
                + Add Customer
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#b5b7c0]">Loading...</div>
        ) : (
          <table className="min-w-[900px] w-full border-separate border-spacing-0 text-left">
            <thead className="text-sm text-[#B5B7C0] font-medium">
              <tr>
                {["Customer Name", "Company", "Phone Number", "Email", "Country", "Status"].map((h) => (
                  <th key={h} className="border-y border-[#eeeeee] px-6 py-3 font-medium">{h}</th>
                ))}
                {/* only show Actions column if user has at least one action permission */}
                {hasActions ? (
                  <th className="border-y border-[#eeeeee] px-6 py-3 font-medium">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {data?.customers.map((customer) => {
                const isActive = customer.status === "Active";
                return (
                  <tr
                    key={customer.id}
                    onClick={() => openWorkspace(customer)}
                    className={`cursor-pointer text-sm transition hover:bg-[#fafafa]`}
                  >
                    <td className="border-b border-[#eeeeee] px-6 py-4 font-medium">{customer.name}</td>
                    <td className="border-b border-[#eeeeee] px-6 py-4">{customer.company}</td>
                    <td className="border-b border-[#eeeeee] px-6 py-4">{customer.phone}</td>
                    <td className="border-b border-[#eeeeee] px-6 py-4">{customer.email}</td>
                    <td className="border-b border-[#eeeeee] px-6 py-4">{customer.country}</td>
                    <td className="border-b border-[#eeeeee] px-6 py-4">
                      <span className={`inline-flex min-w-20 items-center justify-center rounded px-2 py-1 text-xs font-medium ${isActive
                        ? "border border-[#00b087] bg-[#16c09861] text-[#008767]"
                        : "border border-[#df0404] bg-[#ffc5c5] text-[#df0404]"
                        }`}>
                        {customer.status}
                      </span>
                    </td>
                    {hasActions ? (
                      <td className="border-b border-[#eeeeee] px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <RowActions customer={customer} />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-[#b5b7c0]">
        <p>Showing page {page} of {data?.totalPages ?? "—"} ({data?.total ?? "—"} entries)</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-6 w-6 place-items-center rounded-md border border-[#eeeeee] bg-[#f5f5f5] text-[#404b52] disabled:opacity-40"
          >{"<"}</button>

          {getPaginationRange(page, data?.totalPages ?? 1).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="text-xs text-[#b5b7c0] px-1">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p as number)}
                className={`grid h-6 w-6 place-items-center rounded-md border text-xs ${p === page
                  ? "border-[#5932ea] bg-[#5932ea] text-white"
                  : "border-[#eeeeee] bg-[#f5f5f5] text-[#404b52]"
                  }`}
              >{p}</button>
            )
          )}

          <button
            type="button"
            onClick={() => setPage(Math.min(data?.totalPages ?? 1, page + 1))}
            disabled={page === data?.totalPages}
            className="grid h-6 w-6 place-items-center rounded-md border border-[#eeeeee] bg-[#f5f5f5] text-[#404b52] disabled:opacity-40"
          >{">"}</button>
        </div>
      </div>

      <AddCustomerModal
        isOpen={isAddingCustomer}
        onClose={() => setIsAddingCustomer(false)}
      />

      <EditCustomerModal
        key={editingCustomer?.id}
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
      />
      <DeleteCustomerModal
        customer={deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
      />
    </section>
  );
}