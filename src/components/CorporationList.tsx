import { useMemo, useState } from 'react'
import { useJson } from '../useJson'
import { buildIndex, matchesQuery } from '../search'
import type { Corporation } from '../types'

export function CorporationList() {
  const { data, error } = useJson<Corporation>('corporations.json')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('전체')

  const tags = useMemo(() => {
    if (!data) return []
    return ['전체', ...new Set(data.flatMap((c) => c.tags))]
  }, [data])

  /** 기업마다 한 번만 색인을 만들어 둔다. */
  const indexed = useMemo(
    () =>
      (data ?? []).map((corp) => ({
        corp,
        index: buildIndex(
          [corp.name, corp.effect, corp.startingResources],
          [corp.expansion, ...corp.tags],
        ),
      })),
    [data],
  )

  const shown = useMemo(
    () =>
      indexed
        .filter(({ corp, index }) => {
          const okTag = tag === '전체' || corp.tags.includes(tag)
          return okTag && matchesQuery(index, query)
        })
        .map(({ corp }) => corp),
    [indexed, query, tag],
  )

  if (error) return <p className="state state--error">불러오지 못했습니다: {error}</p>
  if (!data) return <p className="state">불러오는 중…</p>

  return (
    <div className="list">
      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          placeholder="한글·영문 모두 검색 (helion, 헬리온, ㅎㄹㅇ)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="기업 검색"
        />
        <div className="chips" role="group" aria-label="태그 필터">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip${tag === t ? ' chip--on' : ''}`}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="count">{shown.length}개 / 전체 {data.length}개</p>

      {shown.map((corp) => (
        <section key={corp.id} className="card" id={`corp-${corp.id}`}>
          <header className="card__head">
            <h3 className="card__name">{corp.name}</h3>
            <span className="expansion">{corp.expansion}</span>
          </header>
          <dl className="card__meta">
            <dt>시작 자원</dt>
            <dd>{corp.startingResources}</dd>
          </dl>
          <p className="card__body">{corp.effect}</p>
          <ul className="tags">
            {corp.tags.map((t) => (
              <li key={t} className="tag">{t}</li>
            ))}
          </ul>
        </section>
      ))}

      {shown.length === 0 && <p className="state">조건에 맞는 기업이 없습니다.</p>}
    </div>
  )
}
