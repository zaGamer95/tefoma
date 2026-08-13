import { useJsonDoc } from '../useJson'

interface Reference {
  title: string
  url: string
  note?: string
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
        {items.map((r, i) => (
          <li key={r.url} className="refs__item">
            <span className="refs__num" aria-hidden="true">
              {i + 1}
            </span>
            <span>
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
        ))}
      </ol>
    </aside>
  )
}
