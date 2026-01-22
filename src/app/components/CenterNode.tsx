import { Handle, Position } from "reactflow";

export default function CenterNode({ data }: any) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 12,
        background: "#2563eb",
        color: "white",
        fontWeight: 600,
        fontSize: 16,
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      }}
    >
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {data.label}
    </div>
  );
}
