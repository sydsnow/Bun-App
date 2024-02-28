import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 //schema: "./schema.ts",
 schema: './server/db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})