import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { documents } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { and } from "drizzle-orm";

export async function GET(
  _: Request, 
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  const { id } = await params; // Simplified - directly destructure after await

  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id));

  return NextResponse.json(doc);
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: docId } = await params; // Added await

  // Optional: verify the document exists and belongs to the user before deleting
  const existingDoc = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, docId), eq(documents.userId, userId)))
    .limit(1);

  if (!existingDoc.length) {
    return NextResponse.json({ error: "Document not found or not owned by user" }, { status: 404 });
  }

  // Delete the document from DB
  await db.delete(documents).where(eq(documents.id, docId));

  // TODO: You might want to delete the file from S3 here as well if desired

  return NextResponse.json({ success: true });
}