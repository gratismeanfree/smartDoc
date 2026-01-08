import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertToAscii(inputString:string){
  const asciiString=inputString.replace(/[^\x00-\x7F]+/g,"")
  return asciiString
}

//chunked Upsert for v6
export async function chunkedUpsert(
  index: any,
  vectors: { id: string; values: number[]; metadata?: Record<string, any> }[],
  namespace?: string,
  batchSize = 100
) {
  if (!vectors || vectors.length === 0) return;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    if (!batch || batch.length === 0) continue;

    console.log(`Attempting upsert batch ${i} to ${i + batch.length - 1}`);
    batch.forEach((v, idx) => {
      console.log(`Vector ${i + idx}: id=${v.id}, values length=${v.values?.length}`);
    });

    try {
      if (namespace) {
        await index.namespace(namespace).upsert(batch);
      } else {
        await index.upsert(batch);
      }
      console.log(`✅ Upserted vectors ${i} to ${i + batch.length - 1}`);
    } catch (err) {
      console.error("❌ Upsert failed for batch:", i, err);
    }
  }
}
/** */
export function generateMermaidFlowchart(data: {
  nodes: { id: string; label: string; class?: string }[];
  edges: { from: string; to: string }[];
}) {
  let mermaid = `flowchart LR\n\n  %% NODES\n\n`;

  // Add node definitions
  for (const node of data.nodes) {
    const nodeClass = node.class ? `:::${node.class}` : "";
    mermaid += `  ${node.id}[${node.label}]${nodeClass}\n`;
  }

  mermaid += `\n  %% EDGES\n\n`;

  // Add edges
  for (const edge of data.edges) {
    mermaid += `  ${edge.from} --> ${edge.to}\n`;
  }

  mermaid += `\n  %% STYLES\n\n`;
  mermaid += `  classDef main fill:#2c3e5a,stroke:#1f2a40,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef product fill:#355a8c,stroke:#1c355a,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef orange fill:#e67e22,stroke:#d35400,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef leaf fill:#f39c12,stroke:#e67e22,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef darkGray fill:#555555,stroke:#e67e22,color:#ffffff,stroke-width:1px;
\n`;

  return mermaid;
}
type DiagramType = "flowchart" | "mindmap" | "timeline" | "classDiagram";

interface FlowchartData {
  nodes: { id: string; label: string; class?: string }[];
  edges: { from: string; to: string }[];
}

interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
}

interface MindmapData {
  rootLabel: string;
  children: MindmapNode[];
}

interface TimelineData {
  title: string;
  events: { date: string; description: string }[];
}

interface ClassDiagramData {
  classes: {
    name: string;
    attributes?: string[];
    methods?: string[];
  }[];
  relationships: {
    from: string;
    to: string;
    label?: string;
  }[];
}

export function generateMermaidDiagram(
  type: DiagramType,
  data: FlowchartData | MindmapData | TimelineData | ClassDiagramData
): string {
  switch (type) {
    case "flowchart":
      return generateMindmap(data as MindmapData);
    case "mindmap":
      return generateMindmap(data as MindmapData);
    case "timeline":
      return generateTimeline(data as TimelineData);
    case "classDiagram":
      return generateClassDiagram(data as ClassDiagramData);
    default:
      throw new Error(`Unsupported diagram type: ${type}`);
  }
}
/**
 * function generateFlowchart(data: FlowchartData): string {
  let mermaid = `flowchart LR\n\n  %% NODES\n\n`;
  for (const node of data.nodes) {
    const nodeClass = node.class ? `:::${node.class}` : "";
    // Wrap labels with spaces/special chars in double parentheses
    const label = /[\s()/\\[\]{}]/.test(node.label) ? `((${node.label}))` : node.label;
    mermaid += `  ${node.id}[${label}]${nodeClass}\n`;
  }
  mermaid += `\n  %% EDGES\n\n`;
  for (const edge of data.edges) {
    mermaid += `  ${edge.from} --> ${edge.to}\n`;
  }
  mermaid += `\n  %% STYLES\n\n`;
  mermaid += `  classDef main fill:#2c3e5a,stroke:#1f2a40,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef product fill:#355a8c,stroke:#1c355a,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef orange fill:#e67e22,stroke:#d35400,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef leaf fill:#f39c12,stroke:#e67e22,color:#ffffff,stroke-width:1px;\n`;
  mermaid += `  classDef light fill:#f7c884,stroke:#e67e22,color:#000000,stroke-width:1px;\n`;
  return mermaid;
}
 * @param data 
 * @returns 
 */


export function generateMindmap(data: MindmapData): string {
  let mermaid = `mindmap\n  root(((${data.rootLabel})))\n`;
  
  function recurse(node: MindmapNode, indent: number) {
    const label = /[\s()/\\[\]{}]/.test(node.label) ? `((${node.label}))` : node.label;
    let str = `${" ".repeat(indent)}${node.id}${label ? ((label.startsWith("((") && label.endsWith("))")) ? label : `(${label})`) : ""}\n`;
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        str += recurse(child, indent + 2);
      }
    }
    return str;
  }

  for (const child of data.children) {
    mermaid += recurse(child, 2);
  }

  return mermaid;
}

function generateTimeline(data: TimelineData): string {
  let mermaid = `timeline\n  title ${data.title}\n`;
  for (const event of data.events) {
    mermaid += `  ${event.date} : ${event.description}\n`;
  }
  return mermaid;
}

function generateClassDiagram(data: ClassDiagramData): string {
  let mermaid = `classDiagram\n`;
  for (const cls of data.classes) {
    mermaid += `  class ${cls.name} {\n`;
    if (cls.attributes) {
      for (const attr of cls.attributes) {
        mermaid += `    +${attr}\n`;
      }
    }
    if (cls.methods) {
      for (const method of cls.methods) {
        mermaid += `    +${method}()\n`;
      }
    }
    mermaid += `  }\n\n`;
  }
  for (const rel of data.relationships) {
    const label = rel.label ? ` : ${rel.label}` : "";
    mermaid += `  ${rel.from} "1" -- "many" ${rel.to}${label}\n`;
  }
  return mermaid;
}



/**
 * 
 export async function chunkedUpsert(
  index: any,
  vectors: { id: string; values: number[]; metadata?: Record<string, any> }[],
  namespace?: string,
  batchSize = 100
) {
  if (!vectors || vectors.length === 0) return;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    if (!batch || batch.length === 0) continue;

    console.log(`Attempting upsert batch ${i} to ${i + batch.length - 1}`);
    console.log("Batch:", batch);

    batch.forEach((v, idx) => {
      console.log(`Vector ${i + idx}: id=${v.id}, values length=${v.values?.length}`);
    });

    try {
      await index.upsert({ vectors: batch, namespace });
      console.log(`Upserted vectors ${i} to ${i + batch.length - 1}`);
    } catch (err) {
      console.error("Upsert failed for batch:", i, err);
    }
  }
}
 */


/**
 * export async function chunkedUpsert( index: any, vectors: Vector[], namespace?: string, batchSize = 100 ) { if (!vectors || vectors.length === 0) return; for (let i = 0; i < vectors.length; i += batchSize) { const batch = vectors.slice(i, i + batchSize); if (!batch || batch.length === 0) continue; await index.upsert({ vectors: batch, namespace }); console.log(Upserted vectors ${i} to ${i + batch.length - 1}); } }
 */