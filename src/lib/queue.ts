import {Queue} from "bullmq"
import IORedis from "ioredis"
const connection=new IORedis();
export const extractionQueue=new Queue('pdf-extraction',{connection});
export const summaryQueue=new Queue('pdf-summary',{connection})
export const mindmapQueue=new Queue('pdf-mindmap',{connection})