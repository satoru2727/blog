# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server (`http://localhost:4321`) |
| `pnpm check` | Astro + TypeScript diagnostics |
| `pnpm lint` | Biome linter (non-formatting) |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm pw:install` | Install Playwright browsers (Chromium) |
| `pnpm pw:install-deps` | Install OS deps for Playwright (Linux; may require `sudo`) |
| `pnpm test:a11y` | Build + run Playwright a11y smoke tests |

## 🧰 Developer Workflow

### pre-commit

This repo uses Husky + lint-staged.

- Install hooks: `pnpm install` (runs `prepare`)
- Run manually: `pnpm lint-staged`

### PR flow (recommended)

1. Create a branch
   - `git switch -c feat/something`
2. Local checks
   - `pnpm lint && pnpm check && pnpm build && pnpm test:a11y`
3. Push + open PR
   - `git push -u origin HEAD`
   - `gh pr create --fill --draft`
4. Enable auto-merge (squash)
   - Turn on “Allow auto-merge” in GitHub repo settings
   - Add label `automerge` to the PR (workflow enables auto-merge)
   - Merging is gated by required checks (e.g. `ci`, `Cloudflare Pages`)

### Review (static checks)

This repo treats CI checks as the “review”. Ensure all checks are green before merging.

### OpenCode (opencode)

OpenCode reads `opencode.json` as project configuration.
This repo enables the `astro_docs` MCP server for Astro documentation.

### GitHub CLI (gh)

- Login / verify: `gh auth login`, `gh auth status`
- Create PR: `gh pr create --fill --draft`
- Enable auto-merge: `gh pr merge --auto --squash --delete-branch`
- View PRs: `gh pr status`, `gh pr list`

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
