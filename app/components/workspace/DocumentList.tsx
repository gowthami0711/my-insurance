"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/store/workspace.store";
import { usePermissions } from "@/hooks/usePermissions";
import { useRef } from "react";
import type { DocumentFile } from "@/app/types/document";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({ customerId }: { customerId: string }) {
  const { activeDocumentId, setActiveDocument } = useWorkspaceStore();
  const { canEdit } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<DocumentFile[]>({
    queryKey: ["documents", customerId],
    queryFn: async () => {
      const res = await fetch(`/api/documents?customerId=${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (file.size > 1024 * 1024 * 500) {
      alert("File too large. Max size is 500MB.");
      return;
    }

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          customerId,
          pages: 1,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("API error:", error);
        alert("Failed to get upload URL: " + JSON.stringify(error));
        return;
      }

      const data = await res.json();

      if (!data.uploadUrl) {
        alert("No upload URL returned");
        return;
      }

      const s3Res = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!s3Res.ok) {
        const errText = await s3Res.text();
        console.error("S3 upload error:", errText);
        alert("S3 upload failed: " + errText);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["documents", customerId] });

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err);
    }

    e.target.value = "";
  }

  return (
    <div className="flex w-56 flex-shrink-0 flex-col bg-white border-r border-[#f0f0f0]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
        <span className="text-xs font-semibold text-[#202224]">Documents</span>
        {canEdit ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 rounded-lg bg-[#5932ea] px-2 py-1.5 text-xs font-medium text-white hover:bg-[#4a28d1] transition"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleUpload}
            />
          </>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f5f6fa]" />
            ))}
          </div>
        ) : documents?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="text-xs font-medium text-[#acacac]">No documents yet</p>
            {canEdit ? (
              <p className="text-xs text-[#c0c0c0]">Click Upload to add one</p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-1">
            {documents?.map((doc: DocumentFile) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveDocument(doc.id)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                  activeDocumentId === doc.id
                    ? "bg-[#f0eeff] border border-[#d4caff]"
                    : "hover:bg-[#f5f6fa]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[#202224]">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-[#acacac]">
                    {formatSize(doc.size)} · {doc.pages}p
                  </p>
                  <div className="mt-1 flex flex-column gap-2">
                    <span className="text-xs text-[#acacac]">Comments: {doc._count.comments}</span>
                    <span className="text-xs text-[#acacac]">Annotations: {doc._count.annotations}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}