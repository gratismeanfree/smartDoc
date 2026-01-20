import { text } from 'drizzle-orm/pg-core';
import "dotenv/config";
import { Worker } from "bullmq";
import { db } from "@/app/lib/db";
import { documents } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
interface MindmapType {
id:string,
text:string,
children:Array<MindmapType>
}
function validateMindmap(data:MindmapType):boolean {
  if (!data || typeof data!=="object") return false

  if (!data.id || typeof data.id !=="string") return false
  if (!data.text|| typeof data.text!=="string") return false

  if (!Array.isArray(data.children)) return false
  for (const child of data.children) if (!validateMindmap(child)) return false
  return true
}
const connection = {
  url: process.env.REDIS_URL!,
  maxRetriesPerRequest: null,
};

const openai = new OpenAI();

console.log("mindmap workers started");
 
const mindmapWorker = new Worker(
  "pdf-mindmap",
  async (job) => {
    const { documentId } = job.data;
    try {
      const [doc] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));

      const completion = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06", // Use a model that supports response_format
  messages: [
    {
      role: "system",
      content: `Generate a mindmap as a JSON object with this structure:
{
  "id": "root",
  "text": "Main Topic",
  "children": [...]
}

Each node has "id" (string), "text" (string), and "children" (array).`,
    },
    {
      role: "user",
      content: `Create a mindmap for: ${doc.summary}`,
    },
  ],
  response_format: { type: "json_object" }, // Forces valid JSON output
  temperature: 0.2,
});

      const jsonString = completion.choices[0].message.content;
      
      if (!jsonString) {
        throw new Error("No response from OpenAI");
      }
      console.log("here is the data from AI:", jsonString);
      
      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("Failed to parse JSON from OpenAI response: " + (e as Error).message);
      }
      if (!validateMindmap(data)) 
        throw new Error("Invalid structure for output")

      await db
        .update(documents)
        .set({ mindmap:data, status: "mindmap_ready" })
        .where(eq(documents.id, documentId));
      
    ;

    } catch (err: any) {
      await db
        .update(documents)
        .set({ status: "mindmap_failed", getErrorMessage: err.message })
        .where(eq(documents.id, documentId));
    }
  },
  { connection }
);

mindmapWorker.on("completed", (job) => {
  console.log(`${job.id} completed`);
});

mindmapWorker.on("failed", (job, err) => {
  console.error(`${job?.id ?? "unknown job"} failed: ${err.message}`);
});