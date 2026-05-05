import { useState } from 'react'

const mockStats = {
  totalMembers: 12,
  totalContributions: 84000,
  totalLoans: 23000,
  totalInterest: 4600,
  pendingApprovals: 3,
  monthlyTarget: 12000,
  collectedThisMonth: 9000,
}

const mockActivity = [
  { id: 1, type: 'contribution', member: 'Thabo Mokoena', amount: 1000, date: '2025-05-01', status: 'approved' },
  { id: 2, type: 'loan',         member: 'Kefilwe Sithole', amount: 5000, date: '2025-05-02', status: 'pending' },
  { id: 3, type: 'contribution', member: 'Mpho Dlamini',   amount: 1000, date: '2025-05-03', status: 'approved' },
  { id: 4, type: 'loan_payment', member: 'Boitumelo Nkosi', amount: 1200, date: '2025-05-04', status: 'pending' },
  { id: 5, type: 'contribution', member: 'Lesego Motsepe',  amount: 1000, date: '2025-05-05', status: 'approved' },
]

const mockMembers = [
  { id: 1, name: 'Thabo Mokoena',   contributed: 5000, interest: 520, loanBalance: 0 },
  { id: 2, name: 'Kefilwe Sithole', contributed: 4000, interest: 380, loanBalance: 5000 },
  { id: 3, name: 'Mpho Dlamini',    contributed: 5000, interest: 490, loanBalance: 0 },
  { id: 4, name: 'Boitumelo Nkosi', contributed: 3000, interest: 210, loanBalance: 8000 },
]

const fmt = n => `P ${n.toLocaleString()}`

const progressBar = (value, max) => {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ background: 'var(--bg-3)', borderRadius: 99, height: 6, marginTop: 8 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand)', borderRadius: 99, transition: 'width 0.4s' }} />
    </div>
  )
}

const badgeFor = status => {
  if (status === 'approved') return <span className="badge badge-green">Approved</span>
  if (status === 'pending')  return <span className="badge badge-amber">Pending</span>
  return <span className="badge badge-muted">{status}</span>
}

const typeLabel = type => {
  if (type === 'contribution')  return <span className="badge badge-blue">Contribution</span>
  if (type === 'loan')          return <span className="badge badge-red">Loan</span>
  if (type === 'loan_payment')  return <span className="badge badge-muted">Loan Payment</span>
  return null
}

export default function Dashboard() {
  const [tab, setTab] = useState('activity')
  const s = mockStats
  const collected = s.collectedThisMonth
  const target = s.monthlyTarget

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">May 2025 — overview of your motshelo group</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{s.totalMembers}</div>
          <div className="stat-note">Active in group</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Contributions</div>
          <div className="stat-value green">{fmt(s.totalContributions)}</div>
          <div className="stat-note">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Loans Outstanding</div>
          <div className="stat-value red">{fmt(s.totalLoans)}</div>
          <div className="stat-note">Across all members</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interest Earned</div>
          <div className="stat-value amber">{fmt(s.totalInterest)}</div>
          <div className="stat-note">From loan charges</div>
        </div>
      </div>

      {/* Monthly progress + pending approvals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Collections</div>
              <div className="card-sub">May 2025 — P1,000 per member</div>
            </div>
            <span className="badge badge-blue">{Math.round((collected/target)*100)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}>
            <span>Collected: <strong style={{ color: 'var(--brand)' }}>{fmt(collected)}</strong></span>
            <span>Target: <strong style={{ color: 'var(--text)' }}>{fmt(target)}</strong></span>
          </div>
          {progressBar(collected, target)}
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            {target - collected > 0 ? `${fmt(target - collected)} still outstanding` : 'Target reached ✓'}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending Approvals</div>
              <div className="card-sub">Require signatory action</div>
            </div>
            {s.pendingApprovals > 0 && (
              <span className="badge badge-red">{s.pendingApprovals} pending</span>
            )}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: s.pendingApprovals > 0 ? 'var(--warning)' : 'var(--brand)', fontFamily: 'var(--mono)' }}>
            {s.pendingApprovals}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            {s.pendingApprovals > 0
              ? 'Loans and payments awaiting approval'
              : 'All caught up — nothing pending'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {['activity', 'members'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
          >
            {t === 'activity' ? 'Recent Activity' : 'Member Summary'}
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      {tab === 'activity' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockActivity.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.member}</td>
                  <td>{typeLabel(a.type)}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{fmt(a.amount)}</td>
                  <td style={{ color: 'var(--muted)' }}>{a.date}</td>
                  <td>{badgeFor(a.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Member Summary */}
      {tab === 'members' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Contributed</th>
                <th>Interest Generated</th>
                <th>Loan Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{fmt(m.contributed)}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>
                    <span style={{ color: m.interest >= 5000 ? 'var(--brand)' : 'var(--warning)' }}>
                      {fmt(m.interest)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 6 }}>/ P5,000</span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', color: m.loanBalance > 0 ? 'var(--danger)' : 'var(--muted)' }}>
                    {m.loanBalance > 0 ? fmt(m.loanBalance) : '—'}
                  </td>
                  <td>
                    {m.loanBalance > 0
                      ? <span className="badge badge-red">Has Loan</span>
                      : <span className="badge badge-green">Clear</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}