import "dotenv/config"
console.log("worker started")

import { Worker } from "bullmq";
import { extractPdf } from "/Users/phuonganh/chatpdf/src/lib/extractPDF";
import { getObjectBuffer } from "/Users/phuonganh/chatpdf/src/lib/getObjectBuffer";
import { documents } from "/Users/phuonganh/chatpdf/src/app/lib/db/schema";
import { db } from "/Users/phuonganh/chatpdf/src/app/lib/db/index";
import { eq } from 'drizzle-orm';
import { summaryQueue } from "../queue";
const connection = {
  connection: process.env.REDIS_URL!,
  maxRetriesPerRequest: null,
};


const extractionWorker=new Worker(
  'pdf-extraction',
  async(job)=>{
    const {documentId,s3Key}=job.data;
    console.log(`[Worker]Processing job for document ${documentId}`)
    try {
      const buffer=await getObjectBuffer(s3Key);
      console.log(`pdf size:${buffer.length}`);
      const extractedText=await extractPdf(buffer)
      await db.update(documents)
      .set({
        extractedText,
        status:"parsed",
        getErrorMessage:null
      }).where(eq(documents.id,documentId));
      console.log(`[Worker]UPdated documents ${documentId} sucessfully`)
      await summaryQueue.add("summarize",{documentId})
    }catch(err:any){
    console.log("failed updating document");
    await db.update(documents).set(
      {status:'parsed_failed',
        getErrorMessage:err.message
      }
    ).where(eq(documents.id,documentId))
  }
  },{connection}
);
extractionWorker.on('completed',(job)=>{
  console.log(`${job.id} completed`)
});
extractionWorker.on('failed',(job,err)=>{
console.error(`${job?.id ?? "unknown job"} failed: ${err.message}`);
})