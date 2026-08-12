/**
 * 한글·영문 교차 검색.
 *
 * 데이터는 한국어로 쓰여 있지만("우주", "건축"), 카드 이름에는 영문이 섞여 있고
 * 태그·종류는 한국어뿐이다. 그래서 'space'로 검색하면 "우주" 태그가 잡히지 않는다.
 * 여기서 색인을 만들 때 동의어를 함께 넣어 양방향으로 잡히게 한다.
 */

/** 같은 줄에 있는 단어끼리 서로 검색된다. 한쪽만 입력해도 나머지가 함께 색인된다. */
const SYNONYMS: string[][] = [
  // 태그
  ['우주', 'space'],
  ['건축', 'building', 'build'],
  ['과학', 'science'],
  ['지구', 'earth'],
  ['목성', 'jovian', 'jupiter'],
  ['식물', 'plant', 'greenery'],
  ['미생물', 'microbe'],
  ['동물', 'animal'],
  ['도시', 'city'],
  ['에너지', 'energy', 'power'],
  ['이벤트', 'event'],
  // 카드 종류
  ['자동', 'automated', 'green'],
  ['액션', 'active', 'action', 'blue'],
  // 자원·수치
  ['열', 'heat'],
  ['철', 'steel'],
  ['티타늄', 'titanium'],
  ['산소', 'oxygen'],
  ['온도', 'temperature'],
  ['바다', 'ocean'],
  ['식물생산', 'plantproduction'],
  ['tr', '명예점수', 'terraformrating'],
  ['vp', '점수', 'victorypoint'],
  // 난이도
  ['난이도하', 'easy'],
  ['난이도중', 'normal', 'medium'],
  ['난이도상', 'hard'],
]

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]

const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3
/** 한 초성이 담당하는 음절 수 (중성 21 × 종성 28) */
const SYLLABLES_PER_CHOSEONG = 588

/** "소행성" -> "ㅅㅎㅅ". 한글이 아닌 글자는 그대로 둔다. */
export function toChoseong(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code >= HANGUL_START && code <= HANGUL_END) {
      out += CHOSEONG[Math.floor((code - HANGUL_START) / SYLLABLES_PER_CHOSEONG)]
    } else {
      out += ch
    }
  }
  return out
}

/** 대소문자·공백·괄호 등을 없애 비교하기 쉬운 형태로. 한글은 NFC로 정규화. */
export function normalize(text: string): string {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\s()[\]{}.,·・/\-_"'’]/g, '')
}

export interface SearchIndex {
  /** 정규화된 본문 + 동의어 */
  plain: string
  /** 위 본문의 초성만 뽑은 것 */
  choseong: string
}

/**
 * 검색 색인을 만든다.
 *
 * @param text  이름·설명 등 자유 문장. **글자 그대로만** 매칭된다.
 * @param terms 태그·종류처럼 어휘가 고정된 값. 동의어까지 확장된다.
 *
 * 동의어를 `text`에 적용하지 않는 이유: "발전소 (Power Plant)"의 이름에 들어 있는
 * 'plant' 때문에 식물 태그가 아닌 카드가 '식물' 검색에 걸리기 때문이다.
 */
export function buildIndex(
  text: Array<string | number>,
  terms: string[] = [],
): SearchIndex {
  const base = normalize([...text, ...terms].join(' '))
  const termBase = normalize(terms.join(' '))

  // 태그·종류에 등장한 동의어 그룹만 그룹 전체를 덧붙인다 → 한글↔영문 양방향 매칭
  let extra = ''
  for (const group of SYNONYMS) {
    if (group.some((word) => termBase.includes(normalize(word)))) {
      extra += group.map(normalize).join('')
    }
  }

  const plain = base + extra
  return { plain, choseong: toChoseong(plain) }
}

/** 입력이 전부 초성 자모인지 (예: "ㅅㅎㅅ") */
function isChoseongQuery(q: string): boolean {
  return q.length > 0 && [...q].every((ch) => CHOSEONG.includes(ch))
}

/**
 * 색인이 검색어와 맞는지.
 * 공백으로 나눈 각 조각이 **모두** 포함되어야 한다 (AND 검색).
 */
export function matchesQuery(index: SearchIndex, query: string): boolean {
  const terms = query.trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true

  return terms.every((raw) => {
    // 초성만 입력한 경우엔 초성 색인에서 찾는다
    if (isChoseongQuery(raw)) return index.choseong.includes(raw)
    const q = normalize(raw)
    return q.length === 0 || index.plain.includes(q)
  })
}
