"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProgressBar } from "./useProgressBar";
export default function ProcessingToast({
  toastId,
  docId,
}: {
  toastId: string|number;
  docId: string;
}) {
  const router = useRouter();
  const finishedRef = useRef(false);
  const {progress, setProgress } = useProgressBar(true);

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
        clearInterval(interval);

        setTimeout(() => {
          toast.success("Document ready", {
            id: toastId,
            action: {
              label: "Open",
              onClick: () => router.push(`/documents/${docId}`),
            },
          });

          // optional auto-redirect
          setTimeout(() => {
            toast.dismiss(toastId)
            router.push(`/documents/${docId}`);
          }, 1500);
        }, 400);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [docId, router, toastId, setProgress]);

  return (
    <div className="w-[320px] space-y-2">
      <p className="font-medium">Processing document…</p>

      <div className="h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-500">
        Extracting · Summarizing · Building mind map
      </p>
    </div>
  );
}
