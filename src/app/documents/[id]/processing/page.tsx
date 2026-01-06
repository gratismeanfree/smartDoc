"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProcessingPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/documents/${params.id}`);
      const doc = await res.json();

      if (doc.status === "completed" || doc.status === "mindmap_ready") {
        clearInterval(interval);
        router.replace(`/documents/${params.id}`);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, router]);

  return (
    <div className="space-y-4">
      <h1>Processing your document…</h1>
      <p>Extracting → Summarizing → Building mind map</p>
    </div>
  );
}
