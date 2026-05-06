"use client";

import { useWorkspaceStore } from "@/store/workspace.store";
import { CustomersTable } from "../customer/CustomersTable";
import { DocumentWorkspace } from "./DocumentWorkspace";

export function WorkspaceLayout() {
  const { isWorkspaceOpen, closeWorkspace } = useWorkspaceStore();

  return (
    <>
      <CustomersTable />

      {isWorkspaceOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeWorkspace}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentWorkspace />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}