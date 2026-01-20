import { Handle,Position } from "reactflow";
import React from 'react'

function CustomMindmapNode({data}:any) {
  return (
    <div
    style={{
      padding:10,
      border:"1px solid #333",
      borderRadius:5

    }}
    >
      <Handle
      type="source"
      position={Position.Right}
    
      />
      {data.label}
      <Handle 
      type="target"
      position={Position.Left}/>
    </div>
  )
}

export default CustomMindmapNode