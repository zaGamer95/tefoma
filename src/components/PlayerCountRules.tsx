import { useMemo, useState } from 'react'
import { useJsonDoc } from '../useJson'

interface Field {
  key: string
  label: string
}

interface CountRules {
  n: number
  label: string
  values: Record<string, string>
  notes: string[]
}

interface PlayerRules {
  source: string
  /** 이 인원수를 표준으로 보고, 다른 값만 강조 표시한다 */
  baseline: number
  fields: Field[]
  counts: CountRules[]
}

const STORAGE_KEY = 'tefoma:playerCount'

export function PlayerCountRules() {
  const { data, error } = useJsonDoc<PlayerRules>('player-rules.json')
  // 고른 인원수를 기억해 둔다. 매번 다시 고르는 건 게임 중에 번거롭다.
  // 사생활 보호 모드 등에서 localStorage 가 막힐 수 있으므로 실패해도 넘어간다.
  const [selected, setSelected] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY))
      if (saved >= 1 && saved <= 5) return saved
    } catch {
      /* 저장소를 못 쓰면 기본값 */
    }
    return 4
  })

  function choose(n: number) {
    setSelected(n)
    try {
      localStorage.setItem(STORAGE_KEY, String(n))
    } catch {
      /* 저장 실패는 무시 — 이번 세션에서는 정상 동작한다 */
    }
  }

  const current = useMemo(
    () => data?.counts.find((c) => c.n === selected) ?? data?.counts[0],
    [data, selected],
  )
  const baseline = useMemo(
    () => data?.counts.find((c) => c.n === data.baseline),
    [data],
  )

  if (error) return <p className="state state--error">불러오지 못했습니다: {error}</p>
  if (!data || !current) return <p className="state">불러오는 중…</p>

  return (
    <section className="pcount" aria-label="인원수별 규칙">
      <header className="pcount__head">
        <h2 className="pcount__title">인원수별 규칙</h2>
        <div className="pcount__tabs" role="group" aria-label="인원수 선택">
          {data.counts.map((c) => (
            <button
              key={c.n}
              type="button"
              className={`pcount__tab${c.n === selected ? ' pcount__tab--on' : ''}`}
              aria-pressed={c.n === selected}
              onClick={() => choose(c.n)}
            >
              {c.n}인
            </button>
          ))}
        </div>
      </header>

      <p className="pcount__label">{current.label}</p>

      <dl className="pcount__grid">
        {data.fields.map((f) => {
          // 표준(3~5인)과 다른 값이면 강조해서 "무엇이 달라지는지"를 바로 보이게
          const differs = baseline ? current.values[f.key] !== baseline.values[f.key] : false
          return (
            <div key={f.key} className={`pcount__row${differs ? ' pcount__row--diff' : ''}`}>
              <dt>{f.label}</dt>
              <dd>
                {current.values[f.key]}
                {differs && <span className="pcount__badge">표준과 다름</span>}
              </dd>
            </div>
          )
        })}
      </dl>

      {current.notes.length > 0 && (
        <ul className="pcount__notes">
          {current.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <p className="pcount__source">{data.source}</p>
    </section>
  )
}
