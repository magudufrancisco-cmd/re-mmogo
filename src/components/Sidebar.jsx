import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⊞', section: 'main' },
  { path: '/group', label: 'Group setup', icon: '◎', section: 'main' },
  { path: '/members', label: 'Members', icon: '◉', section: 'manage' },
  { path: '/contributions', label: 'Contributions', icon: '↑', section: 'manage' },
  { path: '/loans', label: 'Loans', icon: '▤', section: 'manage' },
  { path: '/approvals', label: 'Approvals', icon: '✓', section: 'manage' },
  { path: '/reports', label: 'Reports', icon: '≡', section: 'reports' },
]

export default function Sidebar() {
  const { logoutUser, group } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Re-Mmogo</h1>
        <p>{group?.name || 'Motshelo Manager'}</p>
      </div>
      <nav className="sidebar-nav">
        {['main', 'manage', 'reports'].map(section => (
          <div key={section}>
            <div className="nav-section">{section}</div>
            {navItems.filter(n => n.section === section).map(n => (
              <NavLink
                key={n.path}
                to={n.path}
                end={n.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: 14 }}>{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13 }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}