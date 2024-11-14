import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials:{
    url:"postgresql://neondb_owner:ZL83JhdpOKHE@ep-white-river-a5cf7bsg.us-east-2.aws.neon.tech/ai_mock_interview?sslmode=require" || process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL
  }
});