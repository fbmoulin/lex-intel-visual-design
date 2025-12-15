# Repository Guidelines

## Project Structure & Module Organization
- `client/`: React 19 front-end; key areas are `src/components/`, `src/pages/`, `src/lib/`, and `public/` assets.
- `server/`: Node/Express + tRPC backend; core services in `server/_core/` (auth, env, security, LLM, storage) with API surface in `server/routers.ts` and entrypoint `server/_core/index.ts`.
- `drizzle/`: Database schema/migrations; keep SQL changes here and run via scripts below.
- `docs/`, `scripts/`, `patches/`, `shared/`: Reference docs, automation, dependency patches, and shared utilities.
- Tests live alongside code (e.g., `server/petitions.test.ts`, `server/auth.logout.test.ts`) rather than a top-level `tests/` folder.

## Build, Test, and Development Commands
- Install: `pnpm install` (project uses `pnpm@10` – keep lockfile untouched).
- Dev server: `pnpm run dev` (watches `server/_core/index.ts`; front-end served via Vite).
- Type checking: `pnpm run check`.
- Tests: `pnpm run test` or `pnpm run test:coverage` (Vitest).
- Build: `pnpm run build` (Vite client + bundled server with esbuild); production mode: `pnpm run build:production`.
- Start production bundle: `pnpm run start` (after `pnpm run build`).
- Database: `pnpm run db:push` (generate/apply), `pnpm run db:migrate`, `pnpm run db:studio`.
- Security/deploy helpers: `pnpm run audit:security`, `pnpm run deploy:railway`, `pnpm run prepare:deploy`.

## Coding Style & Naming Conventions
- Language: TypeScript everywhere; avoid `any`; prefer Zod schemas for runtime validation.
- Formatting: Prettier (`pnpm run format`); default 2-space indent; keep imports ordered by tooling.
- UI: Tailwind CSS + Shadcn; compose components in `client/src/components`; favor functional, prop-driven components.
- Naming: `PascalCase` for components/types, `camelCase` for variables/functions, `kebab-case` for files; align API procedures with tRPC router names.

## Testing Guidelines
- Framework: Vitest; colocate `*.test.ts` near subjects (`server/` today). Name tests after behavior (`<feature>.test.ts`).
- Required before PR: `pnpm run check` and `pnpm run test`; include coverage when modifying API or DB flows.
- Prefer deterministic tests; mock network/LLM/S3 calls via dependency seams in `server/_core`.

## Commit & Pull Request Guidelines
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`). Example: `feat: add timeline export to pdf`.
- One topic per commit; keep messages imperative and scoped.
- Before PR: run check + tests + format; update docs/env samples when behavior or config changes.
- PR description should cover what/why, test evidence (`pnpm run test` output), affected routes/components, and screenshots/GIFs for UI changes.
- Link issues and note DB migrations or breaking changes explicitly; prefer small, reviewable diffs.
