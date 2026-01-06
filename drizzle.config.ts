import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: './src/app/lib/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});




/*
import * as dotenv from "dotenv"
dotenv.config({path:'.env'})
const config= {
  driver:'pg',
  schema:'./src/lib/db/schema.ts',
  dbCredentials:{
  connectionString: process.env.DATABASE_URL!
  }
} 
export default config
*/