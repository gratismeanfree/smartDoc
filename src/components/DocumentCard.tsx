import Link from "next/link";
import { useState } from "react";

interface DocumentCardProps {
  doc: {
    id: string;
    pdfName: string;
    createdAt: Date;
    status: string;
    name: string;
  };
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("here is the doc", doc);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return; // Fixed syntax

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}`, { // Fixed syntax
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete document");
      }

      onDelete?.(doc.id);
    } catch (err: any) {
      alert(err.message || "Error deleting document");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Link href={`/documents/${doc.id}`}> {/* Fixed syntax */}
      <div className="relative border rounded-xl p-4 hover:shadow-md transition cursor-pointer flex justify-between items-start">
        <div className="flex-1">
          <h2 className="font-medium mb-1 truncate">{doc.pdfName}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(doc.createdAt).toLocaleDateString()}
          </p>
          <div className="flex justify-between">
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
              {doc.status === "mindmap_ready" ? "completed" : ""}
            </span>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete document"
              className="ml-4 py-1 rounded hover:bg-red-100 text-red-600 transition"
              aria-label="Delete document"
              type="button"
            >
              {isDeleting ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}