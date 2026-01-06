import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
export async function extractPdf(buffer:Buffer): Promise<string> {
const uint8array= new Uint8Array(buffer)
const blob=new Blob([uint8array],{type:"application/pdf"})
const loader=new PDFLoader(blob)
const docs=await loader.load()
const text=docs.map(doc=>doc.pageContent).join("\n")
if (!text || text.length <500){
  throw new Error("Pdf parsed but content too small or empty")
}
return text;
}

