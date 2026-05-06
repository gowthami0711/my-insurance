import { create } from "zustand";
import type { Customer } from "@/lib/api/customers";

type WorkspaceStore = {
  selectedCustomer: Customer | null;
  isWorkspaceOpen: boolean;
  activeDocumentId: string | null;
  activePage: number;
  openWorkspace: (customer: Customer) => void;
  closeWorkspace: () => void;
  setActiveDocument: (id: string | null) => void;
  setActivePage: (page: number) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  selectedCustomer: null,
  isWorkspaceOpen: false,
  activeDocumentId: null,
  activePage: 1,
  openWorkspace: (customer) =>
    set({ selectedCustomer: customer, isWorkspaceOpen: true, activeDocumentId: null, activePage: 1 }),
  closeWorkspace: () =>
    set({ selectedCustomer: null, isWorkspaceOpen: false, activeDocumentId: null }),
  setActiveDocument: (id) => set({ activeDocumentId: id, activePage: 1 }),
  setActivePage: (page) => set({ activePage: page }),
}));