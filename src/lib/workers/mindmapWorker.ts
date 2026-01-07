import "dotenv/config";
import { Worker } from "bullmq";
import { db } from "@/app/lib/db";
import { documents } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import IORedis from "ioredis";
import { generateMermaidFlowchart, generateMindmap } from "@/lib/utils"; // Adjust the import path as needed

const connection = new IORedis(process.env.REDIS_URL!,{ maxRetriesPerRequest: null });
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
        model: "chatgpt-4o-latest",
       messages: [
  {
    role: "system",
    content: `
You are a data formatter. Given the content summary, analyze it and generate a JSON object representing the most appropriate Mermaid diagram structure. The diagram type can be one of: flowchart, mindmap, timeline, or classDiagram.

The JSON output must have the following format, depending on the diagram type:

- For flowchart:
{
  "type": "flowchart",
  "nodes": [
    { "id": "QMP", "label": "Quality Management Presentation", "class": "main" },
    { "id": "RP", "label": "Reporting Period", "class": "main" },
    { "id": "PS1", "label": "Product / Service 1", "class": "product" }
  ],
  "edges": [
    { "from": "QMP", "to": "RP" },
    { "from": "QMP", "to": "PS1" }
  ]
}

- For mindmap:
{
  "type": "mindmap",
  "rootLabel": "Main Root Label",
  "children": [
    {
      "id": "Child1",
      "label": "First Child",
      "children": [ ...nested children... ]
    }
  ]
}

- For timeline:
{
  "type": "timeline",
  "title": "Timeline Title",
  "events": [
    { "date": "2023-01-01", "description": "Start reporting period" },
    { "date": "2023-01-10", "description": "Collect product status data" }
  ]
}

- For classDiagram:
{
  "type": "classDiagram",
  "classes": [
    { "name": "Product", "attributes": ["name", "price"], "methods": ["calculateTax"] }
  ],
  "relationships": [
    { "from": "Product", "to": "Category", "label": "belongsTo" }
  ]
}

Only output the JSON object, no additional text or explanation.


Before outputting, replace **all** special characters in node labels that may cause Mermaid syntax errors with their corresponding HTML entities. Specifically, replace:

- / with &#47;
- \\ with &#92;
- ( with &#40;
- ) with &#41;
- [ with &#91;
- ] with &#93;
- { with &#123;
- } with &#125;
- " with &#34;
- ' with &#39;
- & with &#38;
- < with &#60;
- > with &#62;
- If a label contains spaces or special characters (such as parentheses (), slashes /, backslashes \\, brackets [], braces {}, quotes, ampersands, or angle brackets), wrap the entire label in double parentheses: ((label text)).

- Additionally, replace special characters in labels with their HTML entities where needed, for example, replace / with &#47;.

Output only the JSON object with no extra text or explanation.

Output format example:

{
  "nodes": [
    { "id": "QMP", "label": "Quality Management Presentation", "class": "main" },
    { "id": "RP", "label": "Reporting Period", "class": "main" },
    { "id": "PS1", "label": "Product &#47; Service 1", "class": "product" }
  ],
  "edges": [
    { "from": "QMP", "to": "RP" },
    { "from": "QMP", "to": "PS1" }
  ]
}
`
  },
  {
    role: "user",
    content: doc.summary!,
  },
],
      });

      const jsonString = completion.choices[0].message.content;
      console.log("here is the data from AI:",jsonString)
      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("Failed to parse JSON from OpenAI response: " + (e as Error).message);
      }

      const mindmap = generateMindmap(data);

      console.log("here is the mindmap:", mindmap);

      await db
        .update(documents)
        .set({ mindmap, status: "mindmap_ready" })
        .where(eq(documents.id, documentId));
        console.log("Generated mindmap string:", mindmap);

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
