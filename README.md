# tefoma

Terraforming Mars 개인 가이드 · **[wonbo.site/tefoma](https://wonbo.site/tefoma/)**

**[English](#how-to-update-the-content)** · **[한국어](#내용-수정하는-법)**

---

## How to update the content

**You don't need to install anything.** Every page is one file, and GitHub can edit
files in the browser. Click a link below, edit, and propose the change.

### 1. Pick the file you want to change

| Page on the site | What's in it | Edit it |
| --- | --- | --- |
| 기초 규칙 | Rules explanation | **[01-basics.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/01-basics.md)** |
| 기업별 난이도와 전략 | Corporation strategy | **[04-corp-difficulty.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/04-corp-difficulty.md)** |
| 카드 구매 전략 | Buying strategy | **[05-card-buying.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/05-card-buying.md)** |
| 효과적인 진도 타이밍 | Parameter timing | **[06-parameter-timing.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/06-parameter-timing.md)** |
| 카드별 평가 | Card ratings & notes | **[cards.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/cards.json)** |
| 기업별 일람 | Corporation list | **[corporations.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/corporations.json)** |
| 인원수별 규칙 panel | Per-player-count rules | **[player-rules.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/player-rules.json)** |
| 참고 자료 footnotes | Reference links | **[references.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/references.json)** |

Browse the folders instead: [`src/content/`](https://github.com/zaGamer95/tefoma/tree/main/src/content)
(prose) · [`public/data/`](https://github.com/zaGamer95/tefoma/tree/main/public/data) (data)

### 2. Edit, then propose the change

The edit links open GitHub's editor directly. When you're done, scroll to the bottom:

1. Write a short description of what you changed
2. Choose **"Create a new branch for this commit and start a pull request"**
3. Click **Propose changes** → **Create pull request**

> **Please don't commit straight to `main`.** Always use the pull request option.
> That keeps a record of every change and lets it be reviewed first.

### 3. It goes live automatically

Once the pull request is merged, the site rebuilds and deploys itself.
Give it about a minute, then hard-refresh (`Cmd/Ctrl + Shift + R`).

### Rating a card

In [`cards.json`](https://github.com/zaGamer95/tefoma/edit/main/public/data/cards.json),
find the card and fill in two fields:

```json
{
  "name": "소행성 (Asteroid)",
  "cost": 14,
  "effect": "기온 1단계 상승. 티타늄 자원 2개 획득. …",
  "myRating": 4,
  "myNotes": "식물 기업 상대로 값이 크게 오른다. 티타늄으로 깎을 수 있다는 걸 잊지 말 것.",
  "synergies": ["big-asteroid", "deep-well-heating"]
}
```

- `myRating` — **1 to 5**. Leave it `0` and the card shows as 미평가 (unrated)
- `myNotes` — your own comment, in your own words
- `synergies` — other card `id`s. These become clickable links between cards.
  **Add both directions** so the link works from either card
- **Don't edit `cost`, `type`, `tags`, or `effect`** — those are printed on the card and
  are sourced from the official data. Changing them makes the guide disagree with the
  physical card

### A note on what belongs where

This guide separates **facts** from **opinions**, and it matters:

- **Facts** (`cost`, `type`, `tags`, `effect`, rules text) are copied from official
  sources verbatim. If they don't match the card in your hand, the guide is useless
  mid-game
- **Opinions** (`myRating`, `myNotes`, the strategy pages) are personal judgement.
  Write them in your own voice — don't paste someone else's tier list

Please don't add publisher artwork or card scans. Not a legal worry — the site is used
on a phone mid-game and large images make it slow. SVG and CSS drawings are welcome.

---

## 내용 수정하는 법

**아무것도 설치할 필요 없습니다.** 페이지 하나가 파일 하나이고, GitHub에서 브라우저로
바로 고칠 수 있습니다. 아래 링크를 누르고, 고치고, 변경을 제안하면 됩니다.

### 1. 고칠 파일 고르기

| 사이트의 페이지 | 내용 | 고치러 가기 |
| --- | --- | --- |
| 기초 규칙 | 규칙 설명 | **[01-basics.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/01-basics.md)** |
| 기업별 난이도와 전략 | 기업 전략 | **[04-corp-difficulty.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/04-corp-difficulty.md)** |
| 카드 구매 전략 | 구매 기준 | **[05-card-buying.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/05-card-buying.md)** |
| 효과적인 진도 타이밍 | 파라미터 타이밍 | **[06-parameter-timing.md](https://github.com/zaGamer95/tefoma/edit/main/src/content/06-parameter-timing.md)** |
| 카드별 평가 | 카드 평가와 메모 | **[cards.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/cards.json)** |
| 기업별 일람 | 기업 목록 | **[corporations.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/corporations.json)** |
| 인원수별 규칙 패널 | 인원수별 수치 | **[player-rules.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/player-rules.json)** |
| 참고 자료 각주 | 참고 링크 | **[references.json](https://github.com/zaGamer95/tefoma/edit/main/public/data/references.json)** |

폴더에서 직접 찾기: [`src/content/`](https://github.com/zaGamer95/tefoma/tree/main/src/content)
(글) · [`public/data/`](https://github.com/zaGamer95/tefoma/tree/main/public/data) (데이터)

### 2. 고치고 나서 변경 제안하기

위 링크는 GitHub 편집기를 바로 엽니다. 다 고쳤으면 아래로 내려서:

1. 무엇을 바꿨는지 짧게 적기
2. **"Create a new branch for this commit and start a pull request"** 선택
3. **Propose changes** → **Create pull request** 누르기

> **`main`에 바로 커밋하지 마세요.** 항상 pull request 쪽을 고르세요.
> 그래야 모든 변경 기록이 남고, 먼저 확인해 볼 수 있습니다.

### 3. 자동으로 반영됩니다

pull request가 병합되면 사이트가 알아서 다시 빌드되고 배포됩니다.
1분쯤 기다렸다가 강력 새로고침(`Cmd/Ctrl + Shift + R`) 하세요.

### 카드 평가 쓰는 법

[`cards.json`](https://github.com/zaGamer95/tefoma/edit/main/public/data/cards.json)에서
카드를 찾아 두 칸만 채우면 됩니다.

```json
{
  "name": "소행성 (Asteroid)",
  "cost": 14,
  "effect": "기온 1단계 상승. 티타늄 자원 2개 획득. …",
  "myRating": 4,
  "myNotes": "식물 기업 상대로 값이 크게 오른다. 티타늄으로 깎을 수 있다는 걸 잊지 말 것.",
  "synergies": ["big-asteroid", "deep-well-heating"]
}
```

- `myRating` — **1~5**. `0`으로 두면 화면에 **미평가**로 나옵니다
- `myNotes` — 직접 쓴 메모
- `synergies` — 다른 카드의 `id`. 카드끼리 눌러서 이동하는 링크가 됩니다.
  **양쪽 카드에 서로 추가**해야 어느 쪽에서든 이동됩니다
- **`cost`·`type`·`tags`·`effect`는 고치지 마세요.** 카드에 인쇄된 사실 정보라
  공식 데이터에서 가져온 값입니다. 바꾸면 실물 카드와 표기가 어긋납니다

### 무엇을 어디에 쓸지

이 가이드는 **사실**과 **의견**을 나눠서 관리합니다. 이게 핵심입니다.

- **사실** (`cost`, `type`, `tags`, `effect`, 규칙 설명) — 공식 자료에서 그대로
  가져옵니다. 손에 든 카드와 표기가 다르면 게임 중에 쓸모가 없어집니다
- **의견** (`myRating`, `myNotes`, 전략 문서) — 개인적인 판단입니다.
  직접 쓴 표현으로 적으세요. 남의 티어표를 붙여 넣지 마세요

퍼블리셔 아트워크나 카드 스캔은 넣지 말아 주세요. 저작권 때문이 아니라,
휴대폰으로 게임 중에 보는 사이트라 큰 이미지가 있으면 느려집니다.
SVG나 CSS로 그린 그림은 환영합니다.

---

## For developers

```bash
npm install
npm run dev      # local dev server
npm run build    # must pass before committing
npm run lint
```

- **React + Vite + TypeScript**, no backend. GitHub Pages serves static files only
- `vite.config.ts` must keep `base: '/tefoma/'` — without it the deployed page is blank
- Routing uses `HashRouter`; GitHub Pages has no server-side rewrite
- Deploys on merge to `main` via [`.github/workflows/deploy.yml`](https://github.com/zaGamer95/tefoma/blob/main/.github/workflows/deploy.yml)

Full project rules and constraints: [`CLAUDE.md`](https://github.com/zaGamer95/tefoma/blob/main/CLAUDE.md)
