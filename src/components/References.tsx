import { useJsonDoc } from '../useJson'

/**
 * source — 이 문서의 사실을 확인한 곳
 * reading — 출처는 아니고 더 볼 만한 자료
 * note   — 어디까지가 의견인지 밝히는 항목
 */
type RefKind = 'source' | 'reading' | 'note'

interface Reference {
  kind?: RefKind
  title: string
  url: string
  note?: string
}

const KIND_LABEL: Record<RefKind, string> = {
  source: '출처',
  reading: '더 읽을거리',
  note: '알아두기',
}

type ReferenceMap = Record<string, Reference[]>

interface ReferencesProps {
  /** 섹션 경로. references.json 의 키와 같다. */
  section: string
}

/** 링크에서 보여 줄 도메인만 뽑는다. 어디로 나가는지 미리 알 수 있게. */
function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/**
 * 문서 하단 참고 자료. 해당 섹션에 등록된 항목이 없으면 아무것도 그리지 않는다.
 * 목록은 public/data/references.json 에 있다. (규칙 6번)
 */
export function References({ section }: ReferencesProps) {
  const { data } = useJsonDoc<ReferenceMap>('references.json')
  const items = data?.[section]
  if (!items || items.length === 0) return null

  return (
    <aside className="refs" aria-label="참고 자료">
      <h2 className="refs__title">참고 자료</h2>
      <ol className="refs__list">
        {items.map((r, i) => {
          const kind = r.kind ?? 'source'
          return (
            <li key={r.url + i} className={`refs__item refs__item--${kind}`}>
              <span className="refs__num" aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <span className={`refs__kind refs__kind--${kind}`}>{KIND_LABEL[kind]}</span>
                <a
                  className="refs__link"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.title}
                  <span className="refs__host">{host(r.url)}</span>
                </a>
                {r.note && <span className="refs__note">{r.note}</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
