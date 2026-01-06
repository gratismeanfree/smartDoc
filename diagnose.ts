import { Pinecone } from "@pinecone-database/pinecone";
import 'dotenv/config';
import {OpenAIApi,Configuration} from "openai-edge"

const config= new Configuration ({
  apiKey:process.env.OPENAI_API_KEY,

})
const openai=new OpenAIApi(config)
export async function getEmbeddings(text:string){
  try{
    const response=await openai.createEmbedding({
      model:'text-embedding-ada-002',
      input:text.replace(/\n/g," ")
    })
    const result=await response.json()
    return result.data[0].embedding as number[]


  }
  catch(error){
    console.log("error calling openai embeding api",error)
    throw error

  }
}
async function testEmbedding() {
  const text = "Hello world!";
  const embedding = await getEmbeddings(text);
  console.log("Embedding length:", embedding.length); // should be 1024 for text-embedding-3-small
}

testEmbedding();


// 1️⃣ Initialize client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

// 2️⃣ Get index and namespace
const index = pinecone.Index(process.env.PINECONE_INDEX!);
const namespace = "diagnose-test";

async function diagnosePinecone() {
  try {
    console.log("✅ Pinecone client ready");

    // 3️⃣ Test vectors
   const batch = [
  {
    id: "vec1",
    values: Array(1024).fill(0).map((_, i) => i * 0.001), // tiny non-zero values
    metadata: { text: "hello" },
  },
  {
    id: "vec2",
    values: Array(1024).fill(0).map((_, i) => i * 0.002),
    metadata: { text: "world" },
  },
];


    console.log("Batch ready:", batch.length, "vectors");

    // 4️⃣ Upsert batch
    const response = await index.namespace(namespace).upsert(batch);
    console.log("✅ Upsert response:", response);
  } catch (err) {
    console.error("❌ Error during Pinecone upsert:", err);
  }
}

// Run the diagnostic
diagnosePinecone();
