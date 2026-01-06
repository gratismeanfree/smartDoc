"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProcessingModal({
  docId,
  onClose,
}: {
  docId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const finishedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Fake progress increment
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 85 ? p : Math.min(p + Math.random() * 6, 85)));
    }, 700);
    return () => clearInterval(interval);
  }, [completed]);

  // Poll backend for status
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/documents/${docId}`);
      if (!res.ok) return;

      const doc = await res.json();

      if (
        (doc.status === "completed" || doc.status === "mindmap_ready") &&
        !finishedRef.current
      ) {
        finishedRef.current = true;
        setProgress(100);
        setCompleted(true);

        setTimeout(() => {
          // Auto redirect after a moment
          router.push(`/documents/${docId}`);
          onClose();
        }, 1500);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [docId, router, onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // optional: close modal on backdrop click
    >
      <div
        className="bg-white rounded-lg p-6 w-80 max-w-full"
        onClick={(e) => e.stopPropagation()} // prevent modal close on clicking inside box
      >
        <h2 className="text-lg font-semibold mb-4">Processing document…</h2>

        <div className="h-3 bg-gray-200 rounded overflow-hidden mb-4">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Extracting · Summarizing · Building mind map
        </p>

        {completed && (
          <button
            onClick={() => {
              router.push(`/documents/${docId}`);
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Open Document
          </button>
        )}
      </div>
    </div>
  );
}
