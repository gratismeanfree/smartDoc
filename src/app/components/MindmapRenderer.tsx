"use client"
import CustomMindmapNode from './CustomMindmapNode'
import React, { useState } from 'react'
import ReactFlow, { Node,Edge, Controls, Background } from "reactflow";
import { useEffect } from "react";
import "reactflow/dist/style.css";
interface MindmapType {
id:string,
text:string,
children:Array<MindmapType>
}
interface DataType {
  data: MindmapType | null
}
const nodeTypes={
  mindmapNode:CustomMindmapNode
}

function parsedMindmap(
  node:MindmapType,
  parentId:null | string= null,
  position:{x:number,y:number}={x:0,y:0},
  nodes:Node[]=[],
  edges:Edge[]=[]
) :{nodes:Node[],edges:Edge[]} {
  nodes.push(
    {id:node.id,
    position,
    data:{label:node.text},
    type:"mindmapNode",
    style:{
      padding:10,
      width:20+ node.text.length*8
    }
    
}


  )
  console.log("here is the node list:",nodes)
  if (parentId){
    edges.push(
     { id:`e-${parentId}-${node.id}`,
      source:parentId,
      target:node.id}
    )
    

  }
  if (node.children && node.children.length ){
    let childX=position.x+200;
    let childY=position.y
    node.children.forEach((child)=>{
      parsedMindmap(child,node.id,{x:childX,y:childY},nodes,edges)
      childY+=150
    })
    
  }
  console.log("here is the edges list:",edges)
return {nodes,edges}
}

export default function MindmapRenderer({data}:DataType) {
  const [nodes,setNodes]=useState<Node[]>([])
  const [edges,setEdges]=useState<Edge[]>([])
  
  useEffect(()=>{
    if (!data)
      {throw new Error ("The data is not available")}
    const {nodes:parsedNodes,edges:parsedEdges}=parsedMindmap(
      data,null,{x:0,y:0}
    )
     setNodes(parsedNodes);
     setEdges(parsedEdges)
  }
 
  ,[
    
  ])
  return (
    <div
    style={{
      width:"100%",
      height:"100vh",
      

    }}>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
  

}