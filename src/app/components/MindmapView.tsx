"use client";
import Mermaid from "./Mermaid";
interface MindmapType {
  mindmap:string |null
}
export default function MindmapView({ mindmap }: MindmapType) {
  console.log("Mindmap string passed to Mermaid:", JSON.stringify(mindmap));

  if (!mindmap || mindmap.trim() === "") {
    return <div>No mindmap data available</div>;
  }

  return <Mermaid chart={mindmap} />;
}
