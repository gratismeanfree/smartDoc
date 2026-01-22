"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, { Node, Edge, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

import CenterNode from "./CenterNode";
import LeafNode from "./LeafNode";
import BranchNode from "./BranchNode";

interface MindmapType {
  id: string;
  text: string;
  children: MindmapType[];
}

interface DataType {
  data: MindmapType | null;
}

const nodeTypes = {
  center: CenterNode,
  branch: BranchNode,
  leaf: LeafNode,
};

const GAP_X = 260;
const GAP_Y = 90;



/* ================================
   SUBTREE HEIGHT CALCULATION
================================ */

function computeSubtreeHeight(node: MindmapType): number {
  if (!node.children || node.children.length === 0) return GAP_Y;

  return node.children
    .map(computeSubtreeHeight)
    .reduce((a, b) => a + b, 0);
}

/* ================================
   RECURSIVE LAYOUT ENGINE
================================ */

function layoutMindmap(
  node: MindmapType,
  x: number,
  y: number,
  direction: -1 | 1,
  level: number,
  nodes: Node[],
  edges: Edge[]
) {
  const type = level === 0 ? "center" : level === 1 ? "branch" : "leaf";

  nodes.push({
    id: node.id,
    position: { x, y },
    data: { label: node.text },
    type,
  });

  if (!node.children || node.children.length === 0) return;

  const totalHeight = node.children
    .map(computeSubtreeHeight)
    .reduce((a, b) => a + b, 0);

  let startY = y - totalHeight / 2;

  node.children.forEach((child) => {
    const subtreeHeight = computeSubtreeHeight(child);

    const childX = x + direction * GAP_X;
    const childY = startY + subtreeHeight / 2;

    edges.push({
      id: `e-${node.id}-${child.id}`,
      source: node.id,
      target: child.id,
      type: "smoothstep",
    });

    layoutMindmap(
      child,
      childX,
      childY,
      direction,
      level + 1,
      nodes,
      edges
    );

    startY += subtreeHeight;
  });
}

/* ================================
   ROOT HANDLER (LEFT / RIGHT SPLIT)
================================ */

function buildMindmap(data: MindmapType) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const rootX = 0;
  const rootY = 0;

  nodes.push({
    id: data.id,
    position: { x: rootX, y: rootY },
    data: { label: data.text, 20 },
    type: "center",
  });

  if (!data.children?.length) return { nodes, edges };

  const mid = Math.ceil(data.children.length / 2);
  const left = data.children.slice(0, mid);
  const right = data.children.slice(mid);

  layoutSide(left, -1);
  layoutSide(right, 1);

  function layoutSide(children: MindmapType[], dir: -1 | 1) {
    const totalHeight = children
      .map(computeSubtreeHeight)
      .reduce((a, b) => a + b, 0);

    let startY = rootY - totalHeight / 2;

    children.forEach((child) => {
      const subtreeHeight = computeSubtreeHeight(child);

      const cx = rootX + dir * GAP_X;
      const cy = startY + subtreeHeight / 2;

      edges.push({
        id: `e-${data.id}-${child.id}`,
        source: data.id,
        target: child.id,
        type: "smoothstep",
      });

      layoutMindmap(child, cx, cy, dir, 1, nodes, edges);

      startY += subtreeHeight;
    });
  }

  return { nodes, edges };
}

/* ================================
   MAIN COMPONENT
================================ */

export default function MindmapRenderer({ data }: DataType) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!data) return;

    const { nodes, edges } = buildMindmap(data);
    setNodes(nodes);
    setEdges(edges);
  }, [data]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background gap={24} />
      </ReactFlow>
    </div>
  );
}


/*"use client"
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
  

}*/