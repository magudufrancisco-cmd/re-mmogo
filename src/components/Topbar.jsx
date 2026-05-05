import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const titles = {
  '/': 'Dashboard', '/group': 'Group settings', '/members': 'Members',
  '/contributions': 'Contributions', '/loans': 'Loans',
  '/approvals': 'Approvals', '/reports': 'Reports',
}

export default function Topbar() {
  const { user } = useApp()
  const { pathname } = useLocation()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div className="topbar">
      <div className="topbar-title">{titles[pathname] || 'Re-Mmogo'}</div>
      <div className="topbar-right">
        <div className="badge-group">{user?.groupName || 'Re-Mmogo Group'}</div>
        <div className="avatar">{initials}</div>
      </div>
    </div>
  )
}