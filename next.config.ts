import { config } from './src/middleware';
import type { NextConfig } from "next";
import * as dotenv from "dotenv"
dotenv.config()

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
