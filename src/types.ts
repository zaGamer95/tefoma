export interface Corporation {
  id: string
  name: string
  startingResources: string
  effect: string
  tags: string[]
}

export interface Card {
  id: string
  name: string
  cost: number
  type: string
  tags: string[]
  /** 1–5, 내 주관적 평가. **0 = 아직 평가 안 함** (UI에서 '미평가'로 표시) */
  myRating: number
  myNotes: string
  /** 다른 카드의 id 목록 */
  synergies: string[]
}
