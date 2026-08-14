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
| `corporations.json` | 기업별 일람 | `id`, `name`, `startingResources`, `effect`, `expansion`, `tags` |
| `cards.json` | 카드별 평가 | `id`, `name`, `cost`, `type`, `tags`, `expansion`, `effect`, `myRating` (1–5), `myNotes`, `synergies[]` |

**The two data files are disjoint.** `corporations.json` holds every corporation (89);
`cards.json` holds everything else (852). A corporation must never appear in both — the
카드별 평가 section is for cards you play from hand, not corporations you pick at setup.

`cards.json` holds the **full roster (852)** — base game plus every expansion.

- **기본판 (208)** — complete: cost, type, tags, and printed `effect` all sourced.
  Verified by `cardNumber`, which runs 001–208 with no gaps and no duplicates. Use that
  number range to re-verify after any bulk edit; a count alone won't catch a swap.
  33 of them have an empty `effect` because those cards carry no printed text at all —
  they're icon-only. That is correct data, not a gap to fill.
- **Expansions (644)** — cost, type, tags, and `effect` sourced the same way.
  **프렐류드 (102) and CEO (37) cards have no cost at all** — `cost: null` is correct
  there, not missing data, and the UI hides the cost badge for those two types.
  Of the 713 cards that do have a cost, **every one is filled**.

Unknown values use explicit sentinels, never zero:

- `cost: null` → renders `? M€`
- `type: ""` → the type badge is hidden, and it stays out of the filter list
- `myRating: 0` → renders **미평가**, not zero stars

`expansion` is the module label (`기본판`, `프렐류드`, `비너스 넥스트`, …) and drives its own
filter row. Card data is verified against the open-source implementation
[terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars).

**`synergies[]` references other card `id`s and must render as clickable links that
jump to the referenced card.** This is the single most important feature of the cards
section — the entire point is showing which cards combo together.

The roster is complete; what's left to fill is `myRating` and `myNotes`, and those are
the owner's to write.

---

## Navigation & layout

- Persistent sidebar on desktop (≥1024px) listing all 6 sections, active one highlighted
- Collapses to a top bar with hamburger/drawer on mobile
- Content area scrolls independently; sidebar stays fixed
- Sections switch client-side, no full page reload

## Design

- Near-black background (`#050505`) with **orange as the only accent** (`#ff6a13`).
  Mars sunset gradient and a CSS-drawn starfield. Not a generic Bootstrap look.
- Orbitron for display text (wordmark, numbers, costs, badges) — it has **no Hangul**,
  so never set it as the body font; IBM Plex Sans KR carries all Korean text.
  Both are self-hosted in `public/fonts/`, no external CDN.
- Readable long-form typography: generous line-height, max content width ~70ch for prose
- **Must be usable on a phone** — it gets referenced mid-game

---

## Facts vs. opinions

The dividing line is **fact vs. opinion**, not "written by whom".

**Objective facts — copy them verbatim.** Card names, costs, types, tags, and the effect
text printed on the card. Don't paraphrase these; a reference consulted mid-game must
match what's on the table. Source them from the open-source implementation's card data
and its Korean locale.

**Opinions — only the owner writes these.** Ratings, strategy commentary, difficulty
calls, "when is this worth buying". Never auto-generate them, never fill them with a
plausible-sounding guess, and never present a generated judgement as the owner's.

The data keeps the two apart, and that separation is the point:

| Field | Kind | Who fills it |
| --- | --- | --- |
| `name` `cost` `type` `tags` `effect` | fact | sourced, verbatim |
| `myRating` `myNotes` | opinion | **owner only** |

The same split applies to the prose sections: rules explanations are factual, while the
strategy calls in `04`–`06` are the owner's own and should be edited by them.

## Images

Not a legal restriction — the concern is **payload size**. The site gets used on a phone
mid-game, so a slow first paint is the real cost.

Images are fine when they're efficient: inline SVG, CSS-drawn shapes, or icon sprites.
Prefer vector over raster; avoid publisher artwork scans and large PNG/JPEG assets. The
starfield and Mars orb are drawn with CSS gradients for exactly this reason — zero
requests, zero bytes.

If an asset would help comprehension (resource icons, tag symbols, parameter tracks),
draw it as SVG rather than skipping it.

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
