"use client";
//add a few handle conditions when things don't work out
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import MindmapView from "@/app/components/MindmapRenderer";
import DocumentWorkspace from "@/app/components/DocumentWorkspace";

type Document = {
  id: string;
  status: string;
  summary: string | null;
  mindmap: string | null;
};

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function DocumentView({ id }: { id: string }) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchDoc() {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) throw new Error("Failed to fetch document");
        const data = await res.json();
        setDoc(data);

        if (data.status === "mindmap_ready" || data.status === "completed") {
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
    interval = setInterval(fetchDoc, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <LoadingSpinner />
        <p className="text-gray-600 text-lg">Loading document status…</p>
      </div>
    );
  }

  switch (doc?.status) {
    case "uploaded":
      return (
        <div className="text-center mt-20">
          <LoadingSpinner />
          <p className="text-blue-600 text-lg">📤 Uploaded. Waiting for extraction…</p>
        </div>
      );
    case "parsed":
      return (
        <div className="text-center mt-20">
          <LoadingSpinner />
          <p className="text-blue-600 text-lg">🧠 Generating summary…</p>
        </div>
      );
    case "summarized":
      return (
        <div className="text-center mt-20">
          <LoadingSpinner />
          <p className="text-blue-600 text-lg">🗺 Generating mind map…</p>
        </div>
      );
    case "mindmap_ready":
    case "completed":
      return <DocumentWorkspace doc={doc} />;
    default:
      return (
        <div className="text-center mt-20 text-red-500">
          <p>
            Status: <strong>{doc?.status ?? "Unknown"}</strong> – Content loading or unknown
            status.
          </p>
          <p>Please try refreshing or contact support if this persists.</p>
        </div>
      );
  }
}
