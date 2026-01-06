import { db } from ".";
import { documents } from "./schema";
import { desc, eq } from "drizzle-orm";

export async function getUserDocuments(userId: string) {
  return db
    .select({
      id: documents.id,
      name: documents.pdfName,
      createdAt: documents.createdAt,
      status: documents.status,
    })
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}
