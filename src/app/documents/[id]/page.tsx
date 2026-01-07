import DocumentQuizSection from "@/app/components/DocumentQuizSection";
import DocumentView from "@/components/DocumentView";
export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id}= await params
  return (
    <div>
       <DocumentView id={id} />
       

    </div>
 );
}




/**
 * 
 * import React from 'react'
import { documents } from '@/app/lib/db/schema'
import { db } from '@/app/lib/db'
import { eq } from 'drizzle-orm'
import MindmapView from '@/app/components/MindmapView'
import ReactMarkdown from "react-markdown"
type PageProps={
  params:{
    id:string
  }
}

export default async function DocumentPage({params}:PageProps) {
  const {id}=await params
  const result = await db
  .select()
  .from(documents)
  .where(eq(documents.id,id))
  
  const doc=result[0]
  function cleanMermaidMindmap(text: string): string {
  return text
    .split('\n')
    .map(line => line.trimEnd())  // Remove trailing spaces
    .filter(line => line.trim().length > 0)  // Remove empty lines
    .join('\n')
    .trim();
}
  if(!doc)
    return (<p>Documents not found</p>)
  const cleanedMindmap =doc.mindmap? cleanMermaidMindmap(doc.mindmap):"";
  console.log(cleanedMindmap)
  
  switch(doc.status){
    case "uploaded":
      return <p>📤 Uploaded. Waiting for extraction…</p>;
      case "parsed":
        return <p>🧠 Generating summary…</p>
      case "summarized":
        return <p>🗺 Generating mind map…</p>
      case "completed":
      case "mindmap_ready":
        return (
    <div>
      <div>
          <h2>PDF summary</h2>
          <ReactMarkdown>
            {doc.summary||"Summary is empty."}
          </ReactMarkdown>
      </div>

      <div>
        <MindmapView mermaid={cleanedMindmap} />

      </div>
      


      
    </div>
  )
  default:
    return <p>Status: {doc.status} - Content loading or unknown status.</p>;
  }
  


}
 */
