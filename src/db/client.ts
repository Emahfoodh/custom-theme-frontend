import 'server-only';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema/theme';

function resolveDatabaseUrl() {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? '5432';
  const database = process.env.DB_DATABASE;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  if (!host || !database || !username || !password) {
    throw new Error(
      'Missing DB configuration. Provide DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME/DB_PASSWORD',
    );
  }

  return `postgresql://${username}:${password}@${host}:${port}/${database}`;
}

const connectionString = resolveDatabaseUrl();

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
