# Portfolio

Personal fullstack portfolio site — a public-facing website to showcase projects, writing, and contact info, plus an admin dashboard for managing content.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript (REST API)
- **Database:** PostgreSQL + Prisma ORM
- **AI Chat:** Groq API (openai/gpt-oss-20b)
- **Auth:** JWT (admin only) + Magic Link
- **Hosting:** Vercel (frontend) + Railway (API) + Neon (database)

## Repo layout

```
portfolio/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
├── packages/
│   ├── db/         # Prisma schema + migrations + client
│   └── shared/     # Shared types, zod schemas
├── docs/           # Project documentation
└── .github/        # PR/issue templates, workflows
```

Monorepo via pnpm workspaces + Turborepo.

## Local setup

### Prerequisites

- Node.js 22+
- pnpm 9+
- Docker (for PostgreSQL)

### Steps

1. Clone and install:

```bash
git clone https://github.com/nahyan0077/portfolio.git
cd portfolio
pnpm install
```

2. Start PostgreSQL:

```bash
docker compose up -d portfolio_db
```

3. Set up environment:

```bash
cp .env.example .env
# Edit .env with your values
```

4. Run migrations and seed:

```bash
pnpm db:migrate
pnpm --filter @portfolio/db db:seed
```

5. Start dev servers:

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001

### Admin access

Email: `nahyanm@gmail.com`
Password: set in `.env` via `SEED_ADMIN_PASSWORD`

Login at http://localhost:3000/admin/login

## Scripts

| Command           | Description             |
| ----------------- | ----------------------- |
| `pnpm dev`        | Start all dev servers   |
| `pnpm build`      | Build all packages      |
| `pnpm lint`       | Lint all packages       |
| `pnpm typecheck`  | Type-check all packages |
| `pnpm db:migrate` | Run Prisma migrations   |
| `pnpm db:seed`    | Seed database           |

## License

MIT
