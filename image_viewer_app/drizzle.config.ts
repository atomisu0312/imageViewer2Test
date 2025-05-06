import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: './drizzlea/schema.ts',
  out: "./src/db",
  connectionString: `postgres://${process.env.PG_DB_USER}:${process.env.PG_DB_PASSWORD}@${process.env.PG_DB_HOST}/${process.env.PG_DB_NAME}`,
  // @ts-ignore
  schemaFilter: ["image"],
} satisfies Config;