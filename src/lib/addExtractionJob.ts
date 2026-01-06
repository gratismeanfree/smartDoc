import { documents } from './../app/lib/db/schema';
import { extractionQueue } from "./queue";
export async function addExtractionJob(documentId:string,s3Key:string){
  await extractionQueue.add('extract-text',{
    documentId,
    s3Key
  })
}