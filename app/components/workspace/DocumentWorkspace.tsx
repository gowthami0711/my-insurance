"use client";

import { useWorkspaceStore } from "@/store/workspace.store";
import { DocumentList } from "./DocumentList";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentTools } from "./DocumentTools";

export function DocumentWorkspace() {
  const { isWorkspaceOpen, selectedCustomer, closeWorkspace } = useWorkspaceStore();

  if (!isWorkspaceOpen || !selectedCustomer) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f0eeff] text-sm font-bold text-[#5932ea]">
            {selectedCustomer.name[0]}
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#202224]">{selectedCustomer.name}</h2>
            <p className="text-xs text-[#acacac]">{selectedCustomer.company} · {selectedCustomer.status}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeWorkspace}
          className="grid h-8 w-8 place-items-center rounded-lg text-[#9197b3] hover:bg-[#f5f6fa] transition"
        >
         X
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden bg-[#f5f6fa]">
        <DocumentList customerId={selectedCustomer.id} />
        <DocumentViewer />
        <DocumentTools />
      </div>
    </div>
  );
}