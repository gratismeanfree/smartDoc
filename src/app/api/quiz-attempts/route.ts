import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { quizAttempts } from "@/app/lib/db/schema";

export async function POST(req: Request) {
  const { quizId, score, totalQuestions, answers } = await req.json();

  await db.insert(quizAttempts).values({
    quizId,
    score,
    totalQuestions,
    answers
  });

  return NextResponse.json({ success: true });
}
