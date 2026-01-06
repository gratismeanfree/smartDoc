"use client";
import Mermaid from "./Mermaid";
export default function MindmapView({ mindmap }: { mindmap: string }) {
  console.log("Mindmap string passed to Mermaid:", JSON.stringify(mindmap));

  if (!mindmap || mindmap.trim() === "") {
    return <div>No mindmap data available</div>;
  }

  return <Mermaid chart={mindmap} />;
}
