import basics from './content/01-basics.md?raw'
import corpDifficulty from './content/04-corp-difficulty.md?raw'
import cardBuying from './content/05-card-buying.md?raw'
import parameterTiming from './content/06-parameter-timing.md?raw'

/**
 * 'prose'  — 마크다운 파일을 렌더링
 * 'corps'  — corporations.json 목록 UI
 * 'cards'  — cards.json 목록 UI (시너지 링크 포함)
 */
export type SectionKind = 'prose' | 'corps' | 'cards'

export interface SectionDef {
  /** 해시 라우트 경로. 예: 'cards' -> #/cards */
  path: string
  title: string
  kind: SectionKind
  /** kind === 'prose' 일 때만 존재 */
  content?: string
  /** 본문 위에 얹을 인터랙티브 패널 */
  widget?: 'playerCount'
}

/**
 * 사이드바 순서, 라우트, 제목의 단일 출처.
 * 섹션을 추가하려면 여기에만 넣으면 된다.
 */
export const SECTIONS: SectionDef[] = [
  { path: 'basics', title: '기초 규칙', kind: 'prose', content: basics, widget: 'playerCount' },
  { path: 'corporations', title: '기업별 일람', kind: 'corps' },
  { path: 'cards', title: '카드별 평가', kind: 'cards' },
  { path: 'corp-difficulty', title: '기업별 난이도와 전략', kind: 'prose', content: corpDifficulty },
  { path: 'card-buying', title: '카드 구매 전략', kind: 'prose', content: cardBuying },
  { path: 'parameter-timing', title: '효과적인 진도 타이밍', kind: 'prose', content: parameterTiming },
]
