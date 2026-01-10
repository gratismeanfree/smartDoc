import { Queue } from "bullmq";

const connection = {
  url: process.env.REDIS_URL!,
  maxRetriesPerRequest: null,
};

export const extractionQueue = new Queue('pdf-extraction', { connection });
export const summaryQueue = new Queue('pdf-summary', { connection });
export const mindmapQueue = new Queue('pdf-mindmap', { connection });