import { getErrorMessage } from 'mermaid/dist/utils.js';
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getObjectBuffer } from "@/lib/getObjectBuffer";
import { extractPdf } from "@/lib/extractPDF";
import { eq } from "drizzle-orm";
import { documents } from "@/app/lib/db/schema";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const documentId = params.id;
    console.log("api called with id",params.id)

  // 🔐 AUTH CHECK GOES HERE

  try {
    // 1. Fetch document - get array, extract first item
    const documentsList = await db
      .select({ s3_key: documents.s3Key })
      .from(documents)
      .where(eq(documents.id, documentId));

    if (documentsList.length === 0) {
            console.warn("[API] Document not found:", documentId);

      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const { s3_key } = documentsList[0];
    console.log("[API] S3 key to download:", s3_key);

    // 2. Download PDF from S3
    const buffer = await getObjectBuffer(s3_key);
    console.log("[API] PDF downloaded, size (bytes):", buffer.length);

    // 3. Extract text from PDF
    const text = await extractPdf(buffer);
    console.log("[API] Extracted text length:", text.length);
    // 4. Update document status & extracted_text using Drizzle's update builder
    await db
      .update(documents)
      .set({
        extractedText: text,
        status: "parsed",
        getErrorMessage: null,
      })
      .where(eq(documents.id, documentId));
      console.log("[API] Document updated with extracted text");


    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[API] Extraction failed:", error);

    // Update status to parse_failed and save error message
    await db
      .update(documents)
      .set({
        status: "parsed_failed",
        getErrorMessage: error.message,
      })
      .where(eq(documents.id, documentId));

    return NextResponse.json({ error: "PDF extraction failed" }, { status: 500 });
  }
}
