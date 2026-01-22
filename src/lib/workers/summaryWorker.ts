console.log("summary worker works")

import "dotenv/config"
console.log("summary worker strarted")
import { Worker } from "bullmq";
import { mindmapQueue } from "../queue";
import { db } from "@/app/lib/db";
import { documents } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai"
const connection = {
  url: process.env.REDIS_URL!,
  maxRetriesPerRequest: null,
};
const openai=new OpenAI();
console.log("summary worker works")
const summaryWorker=new Worker("pdf-summary",
  async (job)=>{
    const {documentId}= job.data
    try {
      const [doc]= await db
      .select()
      .from(documents)
      .where(eq(documents.id,documentId))
      const completion= await openai.chat.completions.create(
        {model:"chatgpt-4o-latest",
          messages:[
            {
  role: "system",
  content: `
You are an expert analyst creating structured, high-quality study notes.

TASK:
Organize the content into a clear hierarchical outline with logical grouping.

STRUCTURE RULES (must follow):
1. Use Markdown ONLY, no triple backticks.
2. Create high-level sections using ## for major themes or domains.
3. Within each ## section, create meaningful sub-sections using ### for closely related concepts.
4. Under each ### sub-section, list concise bullet points that capture key ideas.
5. Group related concepts together; do NOT mix unrelated facts.
6. Prefer fewer, well-organized sections over many shallow ones.
7. If a concept does not fit clearly under an existing section, create a new appropriate section.
8. Do NOT include:
   - introductions or conclusions
   - commentary or meta explanations
   - references to the source text
   - filler or generic phrasing
   - the output in triple backticks or code blocks.


GOAL:
The output should read like professional, reliable study notes created by a subject-matter expert but only content from the documents so that you are not hallucinated.

OUTPUT:
Only the structured Markdown content.
`
},
    {
      role: "user",
      content: doc.extractedText!
    }

            ]       }
        
      );
      const summary=completion.choices[0].message.content;
      console.log("here is the summary",summary)
      await db
      .update(documents)
      .set({summary,status:"summarized"})
      .where(eq(documents.id,documentId));
      await mindmapQueue.add("mindmap",{documentId});

     
      
    }catch(err:any){
      await db
      .update(documents)
      .set({status:"summarized_failed",getErrorMessage:err.message})
      .where(eq(documents.id,documentId));
    }},{connection}
)
summaryWorker.on('completed',(job)=>{
  console.log(`${job.id} completed`)
});
summaryWorker.on('failed',(job,err)=>{
console.error(`${job?.id ?? "unknown job"} failed: ${err.message}`);
})