import { create } from "zustand";
import type { Customer } from "@/lib/api/customers";

type CustomersStore = {
  search: string;
  page: number;
  sortBy: "newest" | "name" | "company";
  selectedCustomerId: string | null;
  editingCustomer: Customer | null;      
  deletingCustomer: Customer | null;     
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setSortBy: (sort: CustomersStore["sortBy"]) => void;
  setSelectedCustomerId: (id: string | null) => void;
  setEditingCustomer: (customer: Customer | null) => void;   
  setDeletingCustomer: (customer: Customer | null) => void;  
  isAddingCustomer: boolean;
  setIsAddingCustomer: (val: boolean) => void;
};

export const useCustomersStore = create<CustomersStore>((set) => ({
  search: "",
  page: 1,
  sortBy: "newest",
  selectedCustomerId: null,
  editingCustomer: null,
  deletingCustomer: null,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
  setEditingCustomer: (customer) => set({ editingCustomer: customer }),
  setDeletingCustomer: (customer) => set({ deletingCustomer: customer }),
  isAddingCustomer: false,
  setIsAddingCustomer: (val) => set({ isAddingCustomer: val }),
}));