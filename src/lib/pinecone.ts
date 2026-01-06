import { metadata } from './../app/layout';
import {Pinecone} from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server";
import{PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {RecursiveCharacterTextSplitter,Document} from "@pinecone-database/doc-splitter"
import { getEmbeddings } from './embedding';
import md5 from 'md5';
import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { chunkedUpsert } from './utils';
import { convertToAscii } from './utils';
let pinecone:Pinecone | null=null 
export const  getPineconeClient = async () => {
  if (!pinecone){
      pinecone=new Pinecone()
      
      
    ;
  }
  return pinecone
};
type PDFPage={
  pageContent:string;
  metadata:{
loc:{
    pageNumber:number
  }
  }
  
}
export async function loadS3IntoPinecone(fileKey:string){
//1. obtain the pdf-> download and read from pdf
console.log("downloading s3 into file system")
const file_name=await downloadFromS3(fileKey)
//lanchain provide us with pdf loader which reads the text of the file
if(!file_name){
  throw new Error('could not download from s3')
}
const loader=new PDFLoader(file_name)
const pages=(await loader.load( 
)as PDFPage[])
//2. split and segment documents of smaller documents
//pages=Array(100)
const documents=await Promise.all(pages.map(prepareDocuments))
//vectorise and embed individual documents
const vectors = (await Promise.all(documents.flat().map(embedDocument)))
  .filter((v): v is Vector => v !== null)

const client =await getPineconeClient()
const pineconeIndex=client.Index('chatpdf')
console.log("inserting vectors into pinecone")
const namespace=convertToAscii(fileKey)




if (!vectors.length) {
  console.warn("No valid vectors to upsert. Skipping Pinecone insert.");
  return documents[0];
}
await chunkedUpsert(pineconeIndex,vectors,namespace,10) 
return documents[0]
}
async function embedDocument(doc:Document) {
  try{
    const embeddings= await getEmbeddings(doc.pageContent)
    if (!embeddings || embeddings.length===0){
      console.warn("empty embeddings for document:",doc);
      return null
    }
     
    
    const hash= md5(doc.pageContent)
    return {
      id:hash,
      values:embeddings,
      metadata:{
        text:doc.metadata.text,
        pageNumber:doc.metadata.pageNumber
      }

    }as Vector

  }
  catch(error){
    console.log("error embedding document",error)
    throw error
  }
}
export const truncateStringByBytes= (str:string,bytes:number)=>{
  const enc= new TextEncoder()
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes))
}
async function prepareDocuments(page:PDFPage) {
  let {pageContent,metadata}=page
  pageContent=pageContent.replace(/\n/g,'')
  // split the docs
  const splitter=new RecursiveCharacterTextSplitter()
  const docs= await splitter.splitDocuments([
    new Document(
      {
        pageContent,
        metadata:{
          pageNumber:metadata.loc.pageNumber,
          text:truncateStringByBytes(pageContent,36000)
        }
      }
        
      
    )
  ])
return docs
}