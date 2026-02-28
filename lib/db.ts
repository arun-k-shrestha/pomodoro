// Central DB connection. Every route imports this.

import "server-only";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // check this on the Production
  },
});
