// Central DB connection. Every route imports this.

import "server-only";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

function withoutSslConnectionOptions(value: string) {
  const url = new URL(value);

  url.searchParams.delete("ssl");
  url.searchParams.delete("sslcert");
  url.searchParams.delete("sslkey");
  url.searchParams.delete("sslmode");
  url.searchParams.delete("sslrootcert");

  return url.toString();
}

export const db = new Pool({
  connectionString: withoutSslConnectionOptions(connectionString),
  ssl: {
    rejectUnauthorized: false,
  },
});
