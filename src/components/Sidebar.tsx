import { Link, NavLink } from 'react-router-dom'
import { SECTIONS } from '../sections'

interface SidebarProps {
  /** 모바일 드로어 열림 상태 */
  open: boolean
  onNavigate: () => void
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <nav
      id="sidebar"
      className={`sidebar${open ? ' sidebar--open' : ''}`}
      aria-label="섹션 목록"
    >
      {/*
        로고+제목을 누르면 첫 화면으로. '/' 라우트가 첫 섹션으로 넘겨준다.
        모바일에서는 드로어 안에 있으므로 이동과 함께 드로어를 닫는다.
      */}
      <Link to="/" className="sidebar__brand" onClick={onNavigate}>
        <span className="sidebar__mark" aria-hidden="true" />
        <span className="sidebar__brand-text">
          <strong>tefoma</strong>
          <small>테라포밍 마스 가이드</small>
        </span>
      </Link>

      <ol className="sidebar__list">
        {SECTIONS.map((section, i) => (
          <li key={section.path}>
            <NavLink
              to={`/${section.path}`}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
              onClick={onNavigate}
            >
              <span className="sidebar__num">{String(i + 1).padStart(2, '0')}</span>
              <span>{section.title}</span>
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  )
}
