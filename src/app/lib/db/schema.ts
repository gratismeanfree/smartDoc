import { NotNull } from './../../../../node_modules/drizzle-orm/column-builder.d';
import { integer, pgEnum, serial,text,timestamp,varchar,uuid, jsonb, } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { getErrorMessage } from 'mermaid/dist/utils.js';
export const documentStatusEnum=pgEnum("document_status_enum",[
  "uploaded",
  "parsed",
  "summarized",
  "completed",
  "parsed_failed",
  "summarized_failed",
  "mindmap_ready",
  "mindmap_failed"
]
);
export const users = pgTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(), 
  // this is Clerk userId

  email: varchar("email", { length: 256 }),

  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  plan: text("plan").notNull().default("free"),
  // "free" | "pro"

  subscriptionStatus: text("subscription_status"),
  // "active" | "canceled" | "past_due" | etc

  createdAt: timestamp("created_at").defaultNow(),
});
export const documents=pgTable("documents",{
  id:uuid("id").defaultRandom().primaryKey(),
  userId:varchar("user_id",{length:256}).notNull(),
  pdfName:text("pdf_name").notNull(),
  s3Key:text("s3_key").notNull(),
  extractedText:text("extracted_text"),
  summary:text("summary"),
  mindmap:jsonb("mindmap"),
  status:documentStatusEnum("status")
  .notNull().
  default("uploaded"),
  getErrorMessage:text("error_message"),
  createdAt:timestamp("created_at").notNull().defaultNow()
})
export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" })
    .unique(),
  difficulty: varchar("difficulty").notNull(),
  quizJson: jsonb("quiz_json").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: jsonb("answers").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});


