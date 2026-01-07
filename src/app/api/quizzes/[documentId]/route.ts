import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { quizzes } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ documentId: string }> } // Changed to Promise
) {
  const { documentId } = await params; // Added await

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.documentId, documentId));

  return NextResponse.json(quiz ?? null);
}