
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { documents } from "@/app/lib/db/schema";
import { addExtractionJob } from "@/lib/addExtractionJob";
import { auth } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
export async function POST(req: Request) {
  const {userId}=await auth();
   if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { s3Key, fileName } = await req.json();

  const [doc] = await db
  .insert(documents)
  .values({
    userId,      // REQUIRED
    pdfName: fileName,           // MUST match schema
    s3Key: s3Key,                // MUST match schema
    status: "uploaded",          // optional (default exists)
  })
  .returning({ id: documents.id });

  await addExtractionJob(doc.id,s3Key)
  return NextResponse.json({ documentId: doc.id });
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const userDocs = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(documents.createdAt, "desc");

  return NextResponse.json(userDocs);
}

