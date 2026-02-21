# Custom Theme Frontend

## Local Setup

1. Install dependencies:

```bash
pnpm i
```

2. Start PostgreSQL with Docker Compose:

```bash
docker compose up -d
docker compose ps
```

3. Run Drizzle migrations:

```bash
pnpm db:migrate
```

4. Run the Next.js server:

```bash
pnpm dev
```

App URL: `http://localhost:3000`
