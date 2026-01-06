import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { quizzes, documents } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { createQuiz } from "@/app/lib/ai/createQuiz";

export async function POST(req: Request) {
  const { documentId, difficulty, count } = await req.json();

  // 1. Check existing quiz
  const existing = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.documentId, documentId));

  if (existing.length > 0) {
    return NextResponse.json(existing[0]);
  }

  // 2. Fetch document
  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!doc?.summary) {
    return NextResponse.json(
      { error: "Document not summarized yet" },
      { status: 400 }
    );
  }

  // 3. Generate quiz
  const quizJson = await createQuiz(
    difficulty,
    count,
    doc.summary
  );

  // 4. Save quiz
  const [quiz] = await db
    .insert(quizzes)
    .values({
      documentId,
      difficulty,
      quizJson
    })
    .returning();

  return NextResponse.json(quiz);
}
export async function GET (req:Request) {
  const {searchParams}= new URL(req.url)
  const documentId=searchParams.get("documentId")
  if (!documentId) {
    return NextResponse.json(null)
  }
  const [quiz]=await db 
  .select()
  .from(quizzes)
  .where(eq(quizzes.documentId,documentId))
  return NextResponse.json(quiz ?? null)
}
 
