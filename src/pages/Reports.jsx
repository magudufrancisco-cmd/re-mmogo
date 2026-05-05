import { useState } from 'react'

const fmt  = n => `P ${Number(n).toLocaleString()}`
const pct  = (n, t) => t > 0 ? ((n / t) * 100).toFixed(1) + '%' : '0%'

const MONTHLY_CONTRIBUTION = 1000
const INTEREST_TARGET       = 5000
const MONTHS_IN_YEAR        = 12
const INTEREST_RATE         = 0.20

const mockMembers = [
  { id: 1, name: 'Thabo Mokoena',    contributions: 12, loansTaken: 0,    totalBorrowed: 0,    totalInterestPaid: 0,    loanBalance: 0    },
  { id: 2, name: 'Kefilwe Sithole',  contributions: 12, loansTaken: 1,    totalBorrowed: 5000, totalInterestPaid: 1000, loanBalance: 0    },
  { id: 3, name: 'Mpho Dlamini',     contributions: 11, loansTaken: 1,    totalBorrowed: 4000, totalInterestPaid: 800,  loanBalance: 0    },
  { id: 4, name: 'Boitumelo Nkosi',  contributions: 10, loansTaken: 1,    totalBorrowed: 8000, totalInterestPaid: 1360, loanBalance: 6800 },
  { id: 5, name: 'Lesego Motsepe',   contributions: 9,  loansTaken: 1,    totalBorrowed: 3000, totalInterestPaid: 0,    loanBalance: 3000 },
  { id: 6, name: 'Dineo Khumalo',    contributions: 8,  loansTaken: 0,    totalBorrowed: 0,    totalInterestPaid: 0,    loanBalance: 0    },
]

const totalContributions = mockMembers.reduce((s, m) => s + m.contributions * MONTHLY_CONTRIBUTION, 0)
const totalInterestEarned = mockMembers.reduce((s, m) => s + m.totalInterestPaid, 0)
const totalLoansOutstanding = mockMembers.reduce((s, m) => s + m.loanBalance, 0)
const poolValue = totalContributions + totalInterestEarned - totalLoansOutstanding

const perMemberPayout = mockMembers.map(m => {
  const contributed = m.contributions * MONTHLY_CONTRIBUTION
  const interestContrib = m.totalInterestPaid
  const share = totalContributions > 0 ? (contributed / totalContributions) : 0
  const interestShare = totalInterestEarned * share
  const payout = contributed + interestShare - m.loanBalance
  return { ...m, contributed, interestContrib, interestShare, payout }
})

const topContributor  = [...mockMembers].sort((a,b) => b.contributions - a.contributions)[0]
const topInterest     = [...mockMembers].sort((a,b) => b.totalInterestPaid - a.totalInterestPaid)[0]
const leastContributor = [...mockMembers].sort((a,b) => a.contributions - b.contributions)[0]

export default function Reports() {
  const [tab, setTab] = useState('summary')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Year-End Report</div>
          <div className="page-sub">Financial summary — 2025</div>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>⊡ Print Report</button>
      </div>

      {/* Group summary cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Pool Value</div>
          <div className="stat-value green">{fmt(poolValue)}</div>
          <div className="stat-note">Contributions + interest − loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Contributions</div>
          <div className="stat-value">{fmt(totalContributions)}</div>
          <div className="stat-note">Across all members</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Interest Earned</div>
          <div className="stat-value amber">{fmt(totalInterestEarned)}</div>
          <div className="stat-note">From loan charges @ 20%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Loans Outstanding</div>
          <div className="stat-value red">{fmt(totalLoansOutstanding)}</div>
          <div className="stat-note">Still to be repaid</div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Most Contributions</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand)' }}>{topContributor.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{topContributor.contributions} months paid</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Most Interest Generated</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning)' }}>{topInterest.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{fmt(topInterest.totalInterestPaid)} in interest</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Least Contributions</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>{leastContributor.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{leastContributor.contributions} months paid</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[
          { key: 'summary',  label: 'Member Payouts' },
          { key: 'interest', label: 'Interest Tracker' },
          { key: 'loans',    label: 'Loan Summary' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Member Payouts */}
      {tab === 'summary' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Months Paid</th>
                <th>Contributions</th>
                <th>Interest Share</th>
                <th>Loan Balance</th>
                <th>Estimated Payout</th>
              </tr>
            </thead>
            <tbody>
              {perMemberPayout.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>
                    <span style={{ color: m.contributions === MONTHS_IN_YEAR ? 'var(--brand)' : m.contributions >= 10 ? 'var(--text)' : 'var(--danger)' }}>
                      {m.contributions}/{MONTHS_IN_YEAR}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{fmt(m.contributed)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--warning)' }}>{fmt(m.interestShare.toFixed(0))}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: m.loanBalance > 0 ? 'var(--danger)' : 'var(--muted)' }}>
                    {m.loanBalance > 0 ? fmt(m.loanBalance) : '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: m.payout > 0 ? 'var(--brand)' : 'var(--danger)' }}>
                    {fmt(m.payout.toFixed(0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interest Tracker */}
      {tab === 'interest' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Interest Generated</th>
                <th>Target (P5,000)</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map(m => {
                const progress = Math.min((m.totalInterestPaid / INTEREST_TARGET) * 100, 100)
                const met = m.totalInterestPaid >= INTEREST_TARGET
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--warning)' }}>{fmt(m.totalInterestPaid)}</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{fmt(INTEREST_TARGET)}</td>
                    <td style={{ minWidth: 160 }}>
                      <div style={{ background: 'var(--bg-3)', borderRadius: 99, height: 6 }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: met ? 'var(--brand)' : 'var(--warning)', borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{progress.toFixed(1)}%</div>
                    </td>
                    <td>
                      {met
                        ? <span className="badge badge-green">Target Met</span>
                        : <span className="badge badge-amber">In Progress</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Loan Summary */}
      {tab === 'loans' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Loans Taken</th>
                <th>Total Borrowed</th>
                <th>Interest Paid</th>
                <th>Remaining Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{m.loansTaken}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{m.totalBorrowed > 0 ? fmt(m.totalBorrowed) : '—'}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--warning)' }}>{m.totalInterestPaid > 0 ? fmt(m.totalInterestPaid) : '—'}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: m.loanBalance > 0 ? 'var(--danger)' : 'var(--muted)' }}>
                    {m.loanBalance > 0 ? fmt(m.loanBalance) : '—'}
                  </td>
                  <td>
                    {m.loanBalance > 0
                      ? <span className="badge badge-red">Outstanding</span>
                      : m.totalBorrowed > 0
                        ? <span className="badge badge-green">Cleared</span>
                        : <span className="badge badge-muted">No Loans</span>}
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