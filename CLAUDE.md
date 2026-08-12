# tefoma — Terraforming Mars 가이드 사이트

Personal Terraforming Mars strategy guide. Static site, Korean-language content,
deployed to GitHub Pages. Written for the repo owner's own reference during play.

- **Repo:** https://github.com/zaGamer95/tefoma (public, default branch `main`)
- **Live URL:** https://wonbo.site/tefoma/ — the user site `zaGamer95.github.io` has the
  custom domain `wonbo.site`, and project pages inherit it. The `zagamer95.github.io/tefoma/`
  address redirects there. HTTPS is enforced.
- **The path segment is still `/tefoma/`**, so `base: '/tefoma/'` is correct either way.
  A custom domain does *not* move a project page to the domain root.
- **Site language:** Korean. All UI labels and content in Korean.

---

## Stack

- React + Vite + TypeScript
- **No backend of any kind.** GitHub Pages serves static files only. Never introduce
  a server runtime, API route, or database.
- Python is allowed **only** for offline data-prep scripts in `scripts/`, run manually
  by the owner. Their output is committed JSON — never executed at runtime.

---

## Hard requirements

These are non-negotiable. Violating any of them breaks the deployed site.

1. **`vite.config.ts` must set `base: '/tefoma/'`.** Without it the deployed page
   renders blank. This is a project page, not a user page, so assets live under
   `/tefoma/`, not `/`.
2. **`public/.nojekyll` must exist** (empty file) so GitHub Pages skips its Jekyll
   pass. Jekyll otherwise strips directories beginning with `_`.
3. **Never use root-absolute asset paths** (`/assets/...`). Use relative paths or
   Vite's asset imports, which respect `base`.
4. **Use `HashRouter`, never `BrowserRouter`.** GitHub Pages has no server-side
   rewrite, so refreshing a deep path under `BrowserRouter` 404s. Every section must
   be linkable — e.g. `#/cards`.
5. **Deploy via GitHub Actions:** `.github/workflows/deploy.yml` builds on push to
   `main` and publishes `dist/` using `actions/upload-pages-artifact` +
   `actions/deploy-pages`, with `pages: write` and `id-token: write` permissions.
6. **Content and code stay separate.** No prose or card data hardcoded inside
   components.

---

## Content architecture

Single-page app, 6 sections. Two content types, handled differently.

### Prose sections → Markdown in `src/content/`, rendered with `react-markdown`

| File | Section |
| --- | --- |
| `01-basics.md` | 기초 규칙 |
| `04-corp-difficulty.md` | 기업별 난이도와 전략 |
| `05-card-buying.md` | 카드 구매 전략 |
| `06-parameter-timing.md` | 효과적인 진도(물·열·공기) 타이밍 |

### Data sections → JSON in `public/data/`, rendered as searchable/filterable lists

| File | Section | Fields |
| --- | --- | --- |
| `corporations.json` | 기업별 일람 | `id`, `name`, `startingResources`, `effect`, `tags` |
| `cards.json` | 카드별 평가 | `id`, `name`, `cost`, `type`, `tags`, `expansion`, `myRating` (1–5), `myNotes`, `synergies[]` |

**The two data files are disjoint.** `corporations.json` holds every corporation (77);
`cards.json` holds everything else (864). A corporation must never appear in both — the
카드별 평가 section is for cards you play from hand, not corporations you pick at setup.

`cards.json` holds the **full roster (864)** — base game plus every expansion — but only a
few have details filled in. Unknown values use explicit sentinels, never zero:

- `cost: null` → renders `? M€`
- `type: ""` → the type badge is hidden, and it stays out of the filter list
- `myRating: 0` → renders **미평가**, not zero stars

`expansion` is the module label (`기본판`, `프렐류드`, `비너스 넥스트`, …) and drives its own
filter row. Card data is verified against the open-source implementation
[terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars).

**`synergies[]` references other card `id`s and must render as clickable links that
jump to the referenced card.** This is the single most important feature of the cards
section — the entire point is showing which cards combo together.

Seed each file with 2–3 realistic placeholder entries so the UI is testable. The owner
fills in real content.

---

## Navigation & layout

- Persistent sidebar on desktop (≥1024px) listing all 6 sections, active one highlighted
- Collapses to a top bar with hamburger/drawer on mobile
- Content area scrolls independently; sidebar stays fixed
- Sections switch client-side, no full page reload

## Design

- Mars theme: warm rust/terracotta base on a dark background. Not a generic Bootstrap look.
- Readable long-form typography: generous line-height, max content width ~70ch for prose
- **Must be usable on a phone** — it gets referenced mid-game

---

## Legal

Do not scrape or bulk-copy official card text, artwork, or images from publisher
sources. Card names and numeric costs are fine as factual reference. All descriptive
content must be the owner's own commentary.

---

## Branching — never push directly to `main`

`main` is integration-only. All work lands through a branch and a merge, so every
change has a reviewable record.

1. Branch off `main` with a name matching the Conventional Commit type:
   `feat/카드-시너지-링크`, `fix/…`, `docs/…`, `ci/…`, `chore/…`
2. Commit to that branch (Korean, Conventional Commits)
3. Push the **branch**, open a PR, then merge it in
4. Delete the branch after merge

Never `git push origin main`. `.claude/settings.json` hard-denies it as a backstop.
If a direct push seems necessary, stop and ask instead.

## Conventions

- **Commit messages in Korean, Conventional Commits format** — e.g. `feat: 카드 시너지 링크 추가`
- Never force-push. Never rewrite history on `main`. Never commit secrets.
- Briefly explain the "why" on structural decisions, then proceed
- If a requirement here conflicts with default behavior, **follow the requirement and
  say so**

## Verification

Run `npm run build` and confirm it succeeds **before** committing. A broken build
publishes a blank page.

---

## Environment

Verified 2026-08-12:

- macOS (arm64), zsh, Claude Code 2.1.228
- **No Homebrew.** Install CLI tools as verified release binaries into `~/.local/bin`,
  which is already on `PATH`.
- `gh` 2.97.0 installed at `~/.local/bin/gh`, **authenticated** as `zaGamer95` via
  macOS keyring. Token has `push` and `admin` on this repo. Push access confirmed.
- Git identity is set **repo-locally**: `zaGamer95 / wonbo123@gmail.com`
- `.secrets/` exists, is gitignored, and is currently empty. Tokens live in the
  keyring, not in files.

---

## Status

- [x] `.gitignore` — covers `node_modules`, `dist`, `.DS_Store`, `.env*`, plus
      `.secrets/`, `*.pem`, `*.key`
- [x] `.claude/settings.json` — repo edits and local dev commands allowed; commits,
      pushes, and destructive git prompt. Force-push and `git reset --hard` are
      hard-denied, matching the no-force-push rule above.
- [ ] Vite + React + TS scaffold at repo root (keep existing `README.md`)
- [ ] Layout, navigation, 6 sections with placeholder content
- [ ] `.github/workflows/deploy.yml`
- [ ] Enable Pages: Settings → Pages → Source → **GitHub Actions**
