import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { clearAdminSession, getAdminSession, isAdminLoggedIn } from '../auth/adminSession'
import { ADMIN_MENU, titleForPath } from './adminMenu'

const MOBILE_MQ = '(max-width: 720px)'

type Props = {
  children: ReactNode
  title?: string
}

export default function AdminShell({ children, title }: Props) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/manager/login" replace />
  }

  return <AdminShellFrame title={title}>{children}</AdminShellFrame>
}

function AdminShellFrame({ children, title }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const session = getAdminSession()
  const pageTitle = title || titleForPath(pathname)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ADMIN_MENU.map((g) => [g.id, true])),
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const onChange = () => {
      setIsMobile(mq.matches)
      if (mq.matches) setSidebarCollapsed(true)
    }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isMobile) setSidebarCollapsed(true)
  }, [pathname, isMobile])

  const openTabs = useMemo(() => {
    const tabs: { to: string; label: string }[] = []
    for (const group of ADMIN_MENU) {
      for (const item of group.items) {
        if (item.to === pathname || sessionStorage.getItem(`terea-tab:${item.to}`) === '1') {
          if (!tabs.some((t) => t.to === item.to)) tabs.push(item)
        }
      }
    }
    if (!tabs.some((t) => t.to === pathname)) {
      tabs.push({ to: pathname, label: pageTitle })
    }
    try {
      sessionStorage.setItem(`terea-tab:${pathname}`, '1')
    } catch {
      /* ignore */
    }
    return tabs
  }, [pathname, pageTitle])

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function closeTab(to: string) {
    try {
      sessionStorage.removeItem(`terea-tab:${to}`)
    } catch {
      /* ignore */
    }
    if (to === pathname) {
      const next = openTabs.find((t) => t.to !== to)
      navigate(next?.to || '/manager/visitors')
    } else {
      navigate(pathname)
    }
  }

  const shellClass = [
    'admin-shell',
    sidebarCollapsed ? 'is-sidebar-collapsed' : '',
    isMobile ? 'is-mobile' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClass}>
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-hamburger"
            aria-label={sidebarCollapsed ? '사이드바 열기' : '사이드바 접기'}
            aria-expanded={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((v) => !v)}
          >
            ☰
          </button>
          <span className="admin-brand">terea</span>
          <span className="admin-system-title">방문예약 시스템</span>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-user-label">{session?.id || '관리자'}</span>
          <button
            type="button"
            className="admin-logout"
            onClick={() => {
              clearAdminSession()
              window.location.assign('/manager/login')
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="admin-body">
        {!sidebarCollapsed && isMobile ? (
          <button
            type="button"
            className="admin-sidebar-backdrop"
            aria-label="메뉴 닫기"
            onClick={() => setSidebarCollapsed(true)}
          />
        ) : null}
        <aside className="admin-sidebar" aria-label="관리 메뉴">
          {ADMIN_MENU.map((group) => (
            <div key={group.id} className="admin-side-group">
              <button
                type="button"
                className="admin-side-group-btn"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={openGroups[group.id]}
              >
                <span>{group.label}</span>
                <span aria-hidden>{openGroups[group.id] ? '▾' : '▸'}</span>
              </button>
              {openGroups[group.id] ? (
                <ul className="admin-side-list">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={pathname === item.to ? 'page' : undefined}
                        className={pathname === item.to ? 'is-active' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </aside>

        <div className="admin-main">
          <div className="admin-tabs" role="tablist" aria-label="열린 메뉴">
            {openTabs.map((tab) => (
              <div
                key={tab.to}
                className={`admin-tab${tab.to === pathname ? ' is-active' : ''}`}
                role="tab"
                aria-selected={tab.to === pathname}
              >
                <button type="button" className="admin-tab-label" onClick={() => navigate(tab.to)}>
                  {tab.label}
                </button>
                <button
                  type="button"
                  className="admin-tab-close"
                  aria-label={`${tab.label} 닫기`}
                  onClick={() => closeTab(tab.to)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="admin-content">{children}</div>
        </div>
      </div>
    </div>
  )
}
