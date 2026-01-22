import { Handle, Position } from "reactflow";

export default function LeafNode({ data }: any) {
  return (
    <div
      style={{
        background: "transparent",
        fontSize: 13,
        padding: 2,
        whiteSpace: "nowrap",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
      {data.label}
    </div>
  );
}
