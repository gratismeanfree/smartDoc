"use client"
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const id = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
      flowchart: {
        htmlLabels: true,
        useMaxWidth: false,
      },
    });

    if (ref.current) {
      mermaid
  .render(`mmd-${Math.random().toString(36).slice(2)}`, chart)
  .then(({ svg }) => {
    ref.current!.innerHTML = svg;

    // ⬇️ ADD DEBUG LINE HERE
    console.log("Inserted innerHTML:", ref.current?.innerHTML);

    // Optional visibility fix
    const svgEl = ref.current!.querySelector("svg");
    if (svgEl) {
      svgEl.style.width = "100%";
      svgEl.style.height = "auto";
    }

    console.log("Mermaid render SUCCESS");
  })
  .catch((err) => console.error("Mermaid render ERROR:", err));

    }
  }, [chart]);
  /**
   *  mermaid
        .render(id.current, chart)
        .then(({ svg }) => {
          ref.current!.innerHTML = svg;
        })
        
        .catch((e) => {
          console.error("Mermaid render error:", e);
        })
   */

  return <div ref={ref} style={{minHeight:200}} />;
};

export default Mermaid;



/**
 * 
 * "use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize Mermaid once
    mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",     // REQUIRED for custom colors
  theme: "default",
  flowchart: {
    htmlLabels: true,        // REQUIRED for classDef colors
    useMaxWidth: false
  }
});

    // Render diagram
    if (ref.current) {
      mermaid
        .render("generatedDiagram", chart)
        .then(({ svg }) => {
          // Insert the SVG output into the div
          ref.current!.innerHTML = svg;
          return { svg }; // <-- FIX: return something to satisfy TS
        });
    }
  }, [chart]); // Rerender diagram when 'chart' changes

  return <div ref={ref} />;
};

export default Mermaid;
 */

