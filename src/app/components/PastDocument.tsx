"use client"
import DocumentCard from "@/components/DocumentCard";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
export default function PastDocument({ userId }: { userId: string }) {
  const router = useRouter();
  const [docs, setDocs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDocs() {
    setLoading(true);
    const res = await fetch(`/api/documents?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setDocs(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  async function handleDelete(docId: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    if (res.ok) {
      // Refresh the documents list after deletion
      fetchDocs();
    } else {
      alert("Failed to delete document");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your documents</h1>

      {loading ? (
        <p>Loading...</p>
      ) : docs.length === 0 ? (
        <p className="text-gray-500">No documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDelete={() => handleDelete(doc.id)} />
          ))}
        </div>
      )}
    </div>
  );
}