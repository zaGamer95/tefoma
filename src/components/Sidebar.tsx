import { NavLink } from 'react-router-dom'
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
      <div className="sidebar__brand">
        <span className="sidebar__mark" aria-hidden="true" />
        <div>
          <strong>tefoma</strong>
          <small>테라포밍 마스 가이드</small>
        </div>
      </div>

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
