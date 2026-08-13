import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Prose } from './components/Prose'
import { CorporationList } from './components/CorporationList'
import { CardList } from './components/CardList'
import { PlayerCountRules } from './components/PlayerCountRules'
import { References } from './components/References'
import { SECTIONS } from './sections'
import type { SectionDef } from './sections'

function renderSection(section: SectionDef) {
  switch (section.kind) {
    case 'corps':
      return <CorporationList />
    case 'cards':
      return <CardList />
    case 'prose':
      return <Prose content={section.content ?? ''} />
  }
}

function renderWidget(section: SectionDef) {
  if (section.widget === 'playerCount') return <PlayerCountRules />
  return null
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  // 라우트가 바뀌면 모바일 드로어를 닫고 본문을 맨 위로.
  useEffect(() => {
    setDrawerOpen(false)
    document.querySelector('.content')?.scrollTo({ top: 0 })
  }, [pathname])

  const current = SECTIONS.find((s) => `/${s.path}` === pathname)

  return (
    <div className={`shell${drawerOpen ? ' shell--drawer' : ''}`}>
      <header className="topbar">
        <button
          type="button"
          className="hamburger"
          aria-label="섹션 목록 열기"
          aria-expanded={drawerOpen}
          aria-controls="sidebar"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <span className="topbar__title">{current?.title ?? 'tefoma'}</span>
      </header>

      <Sidebar open={drawerOpen} onNavigate={() => setDrawerOpen(false)} />

      {/* 드로어가 열렸을 때 뒤를 눌러 닫기 */}
      {drawerOpen && (
        <button
          type="button"
          className="scrim"
          aria-label="닫기"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <main className="content">
        <div className="content__inner">
          <Routes>
            <Route path="/" element={<Navigate to={`/${SECTIONS[0].path}`} replace />} />
            {SECTIONS.map((section) => (
              <Route
                key={section.path}
                path={`/${section.path}`}
                element={
                  <>
                    <h1 className="page-title">{section.title}</h1>
                    {renderWidget(section)}
                    {renderSection(section)}
                    {/* 등록된 참고 자료가 없는 섹션에서는 아무것도 그리지 않는다 */}
                    <References section={section.path} />
                  </>
                }
              />
            ))}
            <Route path="*" element={<Navigate to={`/${SECTIONS[0].path}`} replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
