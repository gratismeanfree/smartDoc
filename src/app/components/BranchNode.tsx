import { Handle, Position } from "reactflow";

export default function BranchNode({ data }: any) {
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 10,
        background: "#e0f2fe",
        border: "1px solid #38bdf8",
        fontWeight: 500,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {data.label}
    </div>
  );
}
