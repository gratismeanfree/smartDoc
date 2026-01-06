import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { quizzes } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  { params }: { params: { documentId: string } }
) {
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.documentId, params.documentId));

  return NextResponse.json(quiz ?? null);
}
