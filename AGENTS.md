# Repository Guidelines

## Project Structure & Module Organization
LandingPageBuilder is a Vite + React + TypeScript app centered on the drag-and-drop builder. `src/main.tsx` boots the app and pulls in global SASS from `src/styles`. Feature code lives under `src/components`, with `builder/`, `layout/`, and `ui/` sub-folders for complex reusable pieces, while `pages/` hosts top-level screens and `hooks/`, `stores/`, `utils/`, and `types/` provide shared functionality (Zustand stores live in `src/stores`). Use `public/` for static assets and keep experimental playgrounds (e.g. `test-*.tsx`) isolated from production modules.

## Build, Test, and Development Commands
Install dependencies with `pnpm install`. Run the builder locally using `pnpm dev` and open the Vite URL. Produce an optimized bundle via `pnpm build`; inspect it through `pnpm preview`. Gate changes with `pnpm lint` (ESLint + TypeScript plugin) and `pnpm typecheck` to catch structural regressions early.

## Coding Style & Naming Conventions
Follow the repo Prettier rules (2-space indents, semicolons, single quotes, 100 character width) and let your editor format on save. Author React components as TypeScript function components in PascalCase files (`NewComponentPalette.tsx`), name hooks with a `use` prefix, and keep Zustand stores in camelCase modules. Co-locate styles as `.module.scss` files next to components, relying on design tokens from `src/styles/tokens.scss`. Prefer named exports for shared utilities and keep imports absolute from the project root if paths become noisy.

## Testing Guidelines
Automated testing is still light; treat `pnpm lint`, `pnpm typecheck`, and `pnpm build` as mandatory before pushing. Add targeted interaction tests alongside new modules using `.spec.tsx` files and Vitest once introduced; until then, document manual smoke tests in the PR description (e.g., drag widgets onto the canvas, adjust padding controls, confirm preview mode). Record any temporary playground scripts under `src/test-*` and remove them before release.

## Commit & Pull Request Guidelines
Commits follow Conventional Commit format (`feat(scope): short summary`)—mirror that style for clarity in the changelog. Keep changes focused and reference issues inline (`#123`) where relevant. Pull requests should describe the builder scenarios impacted, list verification steps, and include screenshots or GIFs when UI shifts are visible. Mention outstanding TODOs explicitly so they can be triaged.
