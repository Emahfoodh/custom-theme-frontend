import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });
config();

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

const databaseUrl = resolveDatabaseUrl();

// ts-prune-ignore-next
export default defineConfig({
  out: 'src/db/migrations',
  schema: './src/db/schema/theme.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
