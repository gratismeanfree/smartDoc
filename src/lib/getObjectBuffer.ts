import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3"
import { rejects } from "assert"
import { resolve } from "path"
import { Readable } from "stream"
const s3= new S3Client(
  {region: process.env.AWS_REGION!,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
  }}
)
export function streamToBuffer (stream: Readable) : Promise<Buffer> {
return new Promise((resolve,rejects)=>{
  const chunks: Buffer[]=[];
  stream.on("data",chunk => chunks.push(chunk))
  stream.on("end", ()=>resolve(Buffer.concat(chunks)))
  stream.on("error",rejects)
})
}
export async function getObjectBuffer(s3Key:string): Promise<Buffer> {
const command=new GetObjectCommand(
  {
    Bucket:process.env.AWS_S3_BUCKET,
    Key:s3Key
  }
)
const response= await s3.send(command)
if (!response.Body){
  throw new Error ("S3 Object has no body")
}
return streamToBuffer(response.Body as Readable)
}