import { useEffect, useMemo, useState } from 'react'
import { useJson } from '../useJson'
import { buildIndex, matchesQuery } from '../search'
import type { Card } from '../types'

function Rating({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)))
  // 0 = 아직 평가하지 않음. 별 0개로 두면 "최하점"처럼 보이므로 구분해서 표시한다.
  if (v === 0) return <span className="unrated">미평가</span>
  return (
    <span className="rating" title={`${v} / 5`} aria-label={`평가 ${v}점 만점 5점`}>
      <span className="rating__on" aria-hidden="true">{'★'.repeat(v)}</span>
      <span className="rating__off" aria-hidden="true">{'★'.repeat(5 - v)}</span>
    </span>
  )
}

/** 한 번에 그리는 카드 수. 941장을 전부 그리면 휴대폰에서 버벅인다. */
const PAGE = 60

export function CardList() {
  const { data, error } = useJson<Card>('cards.json')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('전체')
  const [expansion, setExpansion] = useState('전체')
  /** 평가를 아직 안 쓴 카드만 추리기 — 채워 넣을 때 쓴다 */
  const [unratedOnly, setUnratedOnly] = useState(false)
  /** 시너지 링크로 방금 이동한 카드 — 잠시 강조 표시 */
  const [focused, setFocused] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE)

  /** id -> 카드. 시너지 링크의 이름 표시와 유효성 검사에 쓴다. */
  const byId = useMemo(() => {
    const map = new Map<string, Card>()
    data?.forEach((c) => map.set(c.id, c))
    return map
  }, [data])

  // 종류가 비어 있는 카드(아직 확인 안 함)는 필터 목록에 넣지 않는다.
  const types = useMemo(
    () => ['전체', ...new Set((data ?? []).map((c) => c.type).filter(Boolean))],
    [data],
  )

  const expansions = useMemo(
    () => ['전체', ...new Set((data ?? []).map((c) => c.expansion).filter(Boolean))],
    [data],
  )

  /** 카드마다 한 번만 색인을 만들어 둔다. 검색어가 바뀌어도 다시 만들지 않는다. */
  const indexed = useMemo(
    () =>
      (data ?? []).map((card) => ({
        card,
        index: buildIndex(
          [card.name, card.cost ?? '', card.myNotes],
          [card.type, card.expansion, ...card.tags],
        ),
      })),
    [data],
  )

  const shown = useMemo(
    () =>
      indexed
        .filter(({ card, index }) => {
          const okType = type === '전체' || card.type === type
          const okExp = expansion === '전체' || card.expansion === expansion
          const okRated = !unratedOnly || !card.myRating
          return okType && okExp && okRated && matchesQuery(index, query)
        })
        .map(({ card }) => card),
    [indexed, query, type, expansion, unratedOnly],
  )

  // 조건이 바뀌면 다시 처음부터 보여 준다.
  useEffect(() => setLimit(PAGE), [query, type, expansion, unratedOnly])

  const visible = shown.slice(0, limit)

  /**
   * 시너지 링크 클릭. 대상 카드가 현재 필터에 걸러져 있을 수 있으므로
   * 검색어와 필터를 먼저 초기화한 뒤 스크롤한다.
   */
  function jumpTo(id: string) {
    setQuery('')
    setType('전체')
    setExpansion('전체')
    setUnratedOnly(false)
    // 필터를 지우면 대상이 목록 뒤쪽에 올 수 있다. 그 카드까지 그려지도록 한도를 올린다.
    const pos = (data ?? []).findIndex((c) => c.id === id)
    if (pos >= 0) setLimit((cur) => Math.max(cur, pos + 1))
    setFocused(id)
  }

  // 필터 초기화가 반영되어 DOM이 다시 그려진 뒤에 스크롤해야 한다.
  useEffect(() => {
    if (!focused) return
    document
      .getElementById(`card-${focused}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const timer = setTimeout(() => setFocused(null), 1800)
    return () => clearTimeout(timer)
  }, [focused])

  if (error) return <p className="state state--error">불러오지 못했습니다: {error}</p>
  if (!data) return <p className="state">불러오는 중…</p>

  return (
    <div className="list">
      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          placeholder="한글·영문 모두 검색 (space, 우주, ㅅㅎㅅ)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="카드 검색"
        />
        <div className="chips" role="group" aria-label="확장 필터">
          {expansions.map((e) => (
            <button
              key={e}
              type="button"
              className={`chip${expansion === e ? ' chip--on' : ''}`}
              onClick={() => setExpansion(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="종류 필터">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip${type === t ? ' chip--on' : ''}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            className={`chip chip--alt${unratedOnly ? ' chip--on' : ''}`}
            onClick={() => setUnratedOnly((v) => !v)}
            aria-pressed={unratedOnly}
          >
            미평가만
          </button>
        </div>
      </div>

      <p className="count">
        {shown.length}장 / 전체 {data.length}장
        {visible.length < shown.length && ` — ${visible.length}장 표시 중`}
      </p>

      {visible.map((card) => (
        <section
          key={card.id}
          id={`card-${card.id}`}
          className={`card${focused === card.id ? ' card--focused' : ''}`}
        >
          <header className="card__head">
            <h3 className="card__name">{card.name}</h3>
            {card.cost === null ? (
              <span className="cost cost--unknown" title="비용 미확인">? M€</span>
            ) : (
              <span className="cost" title="비용">{card.cost} M€</span>
            )}
          </header>

          <div className="card__meta card__meta--row">
            <span className="expansion">{card.expansion}</span>
            {card.type && <span className="type">{card.type}</span>}
            <Rating value={card.myRating} />
          </div>

          {card.myNotes ? (
            <p className="card__body">{card.myNotes}</p>
          ) : (
            <p className="card__body card__body--empty">
              아직 메모를 쓰지 않았습니다. <code>public/data/cards.json</code> 의{' '}
              <code>myNotes</code> 와 <code>myRating</code> 을 채우세요.
            </p>
          )}

          <ul className="tags">
            {card.tags.map((t) => (
              <li key={t} className="tag">{t}</li>
            ))}
          </ul>

          {card.synergies.length > 0 && (
            <div className="synergy">
              <span className="synergy__label">시너지</span>
              <ul className="synergy__list">
                {card.synergies.map((id) => {
                  const target = byId.get(id)
                  // 존재하지 않는 id를 참조하는 경우 — 데이터 오타를 눈에 띄게 한다.
                  if (!target) {
                    return (
                      <li key={id}>
                        <span className="synergy__missing" title="이런 id의 카드가 없습니다">
                          {id} (없음)
                        </span>
                      </li>
                    )
                  }
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="synergy__link"
                        onClick={() => jumpTo(id)}
                      >
                        {target.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      ))}

      {visible.length < shown.length && (
        <button
          type="button"
          className="more"
          onClick={() => setLimit((n) => n + PAGE)}
        >
          {Math.min(PAGE, shown.length - visible.length)}장 더 보기
          <small> (남은 {shown.length - visible.length}장)</small>
        </button>
      )}

      {shown.length === 0 && <p className="state">조건에 맞는 카드가 없습니다.</p>}
    </div>
  )
}
