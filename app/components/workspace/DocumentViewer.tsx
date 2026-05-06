"use client";

import { useWorkspaceStore } from "@/store/workspace.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { DocumentFile } from "@/app/types/document";

export function DocumentViewer() {
  const { activeDocumentId, activePage, setActivePage } = useWorkspaceStore();
  const [zoom, setZoom] = useState(100);

  const { data: document, isLoading } = useQuery<DocumentFile>({
    queryKey: ["document", activeDocumentId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${activeDocumentId}`);
      if (!res.ok) throw new Error("Failed to fetch document");
      return res.json();
    },
    enabled: !!activeDocumentId,
  });

  if (!activeDocumentId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-sm font-medium text-[#202224]">Select a document</p>
          <p className="text-xs text-[#acacac]">Choose a document from the list to view it</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#5932ea] border-t-transparent" />
          <p className="text-sm text-[#acacac]">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-2">
        <p className="truncate text-sm font-medium text-[#202224] max-w-[200px]">
          {document?.name}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[#f5f6fa] text-[#9197b3] font-medium"
          >
            -
          </button>
          <span className="text-xs text-[#acacac] w-12 text-center">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[#f5f6fa] text-[#9197b3] font-medium"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-[#f5f6fa] p-4">
        <div
          style={{ width: `${zoom}%`, margin: "0 auto" }}
          className="transition-all duration-200"
        >
          <iframe
            src={`${document?.viewUrl}#page=${activePage}`}
            className="w-full rounded-xl shadow-md bg-white p-4"
            style={{ height: "70vh" }}
            title={document?.name}
          />
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-center gap-4 border-t border-[#f0f0f0] px-4 py-3">
        <button
          type="button"
          onClick={() => setActivePage(Math.max(1, activePage - 1))}
          disabled={activePage === 1}
          className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[#f5f6fa] text-[#9197b3] disabled:opacity-40"
        >
          &lt;
        </button>
        <span className="text-xs text-[#acacac]">
          Page {activePage} of {document?.pages ?? "—"}
        </span>
        <button
          type="button"
          onClick={() => setActivePage(Math.min(document?.pages ?? 1, activePage + 1))}
          disabled={activePage === document?.pages}
          className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[#f5f6fa] text-[#9197b3] disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}