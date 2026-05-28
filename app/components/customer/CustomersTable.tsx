"use client";

import { memo, useCallback } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomersStore } from "@/store/customers.store";
import { usePermissions } from "@/hooks/usePermissions";
import { AddCustomerModal } from "./AddCustomerModal";
import { EditCustomerModal } from "./EditCustomerModal";
import { DeleteCustomerModal } from "./DeleteCustomerModal";
import { RowActions } from "./RowActions";
import { CustomersPagination } from "./CustomersPagination";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { Customer } from "@/lib/api/customers";
import Image from "next/image";

const TABLE_HEADERS = [
  "Customer Name",
  "Company",
  "Phone Number",
  "Email",
  "Country",
  "Status",
] as const;

type CustomerRowProps = {
  customer: Customer;
  hasActions: boolean;
  onOpenWorkspace: (customer: Customer) => void;
};

const CustomerRow = memo(function CustomerRow({
  customer,
  hasActions,
  onOpenWorkspace,
}: CustomerRowProps) {
  const isActive = customer.status === "Active";

  return (
    <tr
      onClick={() => onOpenWorkspace(customer)}
      className="cursor-pointer text-sm transition hover:bg-[#fafafa]"
    >
      <td className="border-b border-[#eeeeee] px-6 py-4 font-medium">{customer.name}</td>
      <td className="border-b border-[#eeeeee] px-6 py-4">{customer.company}</td>
      <td className="border-b border-[#eeeeee] px-6 py-4">{customer.phone}</td>
      <td className="border-b border-[#eeeeee] px-6 py-4">{customer.email}</td>
      <td className="border-b border-[#eeeeee] px-6 py-4">{customer.country}</td>
      <td className="border-b border-[#eeeeee] px-6 py-4">
        <span
          className={`inline-flex min-w-20 items-center justify-center rounded px-2 py-1 text-xs font-medium ${
            isActive
              ? "border border-[#00b087] bg-[#16c09861] text-[#008767]"
              : "border border-[#df0404] bg-[#ffc5c5] text-[#df0404]"
          }`}
        >
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
});

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
  const handleOpenWorkspace = useCallback(
    (customer: Customer) => openWorkspace(customer),
    [openWorkspace],
  );

  const hasActions = canEdit || canDelete || canAssign;

  if (isError) return <p className="p-6 text-red-500">Something went wrong.</p>;

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
                {TABLE_HEADERS.map((h) => (
                  <th key={h} className="border-y border-[#eeeeee] px-6 py-3 font-medium">{h}</th>
                ))}
                {/* only show Actions column if user has at least one action permission */}
                {hasActions ? (
                  <th className="border-y border-[#eeeeee] px-6 py-3 font-medium">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {data?.customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  hasActions={hasActions}
                  onOpenWorkspace={handleOpenWorkspace}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data ? (
        <CustomersPagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          onPageChange={setPage}
        />
      ) : null}

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