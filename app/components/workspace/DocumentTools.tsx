"use client";

import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePermissions } from "@/hooks/usePermissions";
import type { Comment, Annotation } from "@/app/types/document";

type Tab = "comments" | "annotations";

export function DocumentTools() {
  const [tab, setTab] = useState<Tab>("comments");
  const [comment, setComment] = useState("");
  const { activeDocumentId, activePage } = useWorkspaceStore();
  const { data: session } = useSession();
  const { canEdit } = usePermissions();
  const queryClient = useQueryClient();

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["comments", activeDocumentId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${activeDocumentId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!activeDocumentId,
  });

  const { data: annotations } = useQuery<Annotation[]>({
    queryKey: ["annotations", activeDocumentId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${activeDocumentId}/annotations`);
      if (!res.ok) throw new Error("Failed to fetch annotations");
      return res.json();
    },
    enabled: !!activeDocumentId,
  });

  const addComment = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/documents/${activeDocumentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          page: activePage,
          author: session?.user?.name ?? "Unknown",
        }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", activeDocumentId] });
      setComment("");
    },
  });

  if (!activeDocumentId) return null;

  const pageComments = comments?.filter((c) => c.page === activePage) ?? [];
  const pageAnnotations = annotations?.filter((a) => a.page === activePage) ?? [];

  return (
    <div className="flex w-64 flex-shrink-0 flex-col border-l border-[#f0f0f0]">
      {/* Tabs */}
      <div className="flex border-b border-[#f0f0f0]">
        {(["comments", "annotations"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-medium capitalize transition ${
              tab === t
                ? "border-b-2 border-[#5932ea] text-[#5932ea]"
                : "text-[#9197b3]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Page indicator */}
      <div className="border-b border-[#f0f0f0] px-4 py-2">
        <p className="text-xs text-[#acacac]">Page {activePage}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tab === "comments" ? (
          <>
            {pageComments.map((c) => (
              <div key={c.id} className="rounded-xl bg-[#f9fbff] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#5932ea]">{c.author}</span>
                  <span className="text-xs text-[#acacac]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#202224]">{c.content}</p>
              </div>
            ))}
            {pageComments.length === 0 && (
              <p className="text-center text-xs text-[#acacac] py-4">
                No comments on this page
              </p>
            )}
          </>
        ) : (
          <>
            {pageAnnotations.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border-l-4 bg-[#f9fbff] p-3"
                style={{ borderColor: a.color }}
              >
                <p className="text-xs font-medium text-[#202224]">{a.note ?? "Highlight"}</p>
                <p className="text-xs text-[#acacac]">by {a.author}</p>
              </div>
            ))}
            {pageAnnotations.length === 0 && (
              <p className="text-center text-xs text-[#acacac] py-4">
                No annotations on this page
              </p>
            )}
          </>
        )}
      </div>

      {/* Add comment */}
      {canEdit && tab === "comments" ? (
        <div className="border-t border-[#f0f0f0] p-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-3 py-2 text-xs outline-none focus:border-[#5932ea] transition"
          />
          <button
            type="button"
            onClick={() => addComment.mutate()}
            disabled={!comment.trim() || addComment.isPending}
            className="mt-2 w-full rounded-xl bg-[#5932ea] py-2 text-xs font-semibold text-white hover:bg-[#4a28d1] disabled:opacity-60"
          >
            {addComment.isPending ? "Adding..." : "Add Comment"}
          </button>
        </div>
      ) : null}
    </div>
  );
}