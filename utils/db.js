import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema  from "./schema"
const sql = neon("postgresql://neondb_owner:ZL83JhdpOKHE@ep-white-river-a5cf7bsg.us-east-2.aws.neon.tech/ai_mock_interview?sslmode=require"||process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);
 export const db = drizzle(sql,{schema});