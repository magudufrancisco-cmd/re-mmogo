import { useState } from 'react'

const MONTHLY = 1000

const mockMembers = [
  { id: 1, name: 'Thabo Mokoena' },
  { id: 2, name: 'Kefilwe Sithole' },
  { id: 3, name: 'Mpho Dlamini' },
  { id: 4, name: 'Boitumelo Nkosi' },
  { id: 5, name: 'Lesego Motsepe' },
  { id: 6, name: 'Dineo Khumalo' },
]

const initContributions = [
  { id: 1, memberId: 1, memberName: 'Thabo Mokoena',    month: '2025-01', amount: 1000, status: 'approved', date: '2025-01-05' },
  { id: 2, memberId: 2, memberName: 'Kefilwe Sithole',  month: '2025-01', amount: 1000, status: 'approved', date: '2025-01-04' },
  { id: 3, memberId: 3, memberName: 'Mpho Dlamini',     month: '2025-01', amount: 1000, status: 'approved', date: '2025-01-06' },
  { id: 4, memberId: 1, memberName: 'Thabo Mokoena',    month: '2025-02', amount: 1000, status: 'approved', date: '2025-02-03' },
  { id: 5, memberId: 4, memberName: 'Boitumelo Nkosi',  month: '2025-02', amount: 1000, status: 'pending',  date: '2025-02-07' },
  { id: 6, memberId: 5, memberName: 'Lesego Motsepe',   month: '2025-05', amount: 1000, status: 'pending',  date: '2025-05-01' },
]

const months = ['2025-01','2025-02','2025-03','2025-04','2025-05']
const fmt = n => `P ${n.toLocaleString()}`

const empty = { memberId: '', month: '', amount: MONTHLY, proof: '' }

export default function Contributions() {
  const [contributions, setContributions] = useState(initContributions)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.memberId) e.memberId = 'Select a member'
    if (!form.month)    e.month    = 'Select a month'
    if (!form.amount || form.amount < 1) e.amount = 'Enter a valid amount'
    const exists = contributions.find(c => c.memberId === Number(form.memberId) && c.month === form.month)
    if (exists) e.memberId = 'This member already has a contribution for that month'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    const member = mockMembers.find(m => m.id === Number(form.memberId))
    setContributions(cs => [...cs, {
      id: Date.now(),
      memberId: Number(form.memberId),
      memberName: member.name,
      month: form.month,
      amount: Number(form.amount),
      status: 'pending',
      date: new Date().toISOString().slice(0,10),
    }])
    setShowModal(false)
    setForm(empty)
  }

  const filtered = contributions.filter(c => {
    if (filterMonth !== 'all' && c.month !== filterMonth) return false
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    return true
  })

  const totalApproved = contributions.filter(c => c.status === 'approved').reduce((s,c) => s + c.amount, 0)
  const totalPending  = contributions.filter(c => c.status === 'pending').reduce((s,c)  => s + c.amount, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Contributions</div>
          <div className="page-sub">P1,000 per member per month</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setErrors({}); setShowModal(true) }}>
          + Record Payment
        </button>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Approved</div>
          <div className="stat-value green">{fmt(totalApproved)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value amber">{fmt(totalPending)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{contributions.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ minWidth: 160 }}>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="all">All Months</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ minWidth: 160 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Date Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className="empty-state"><div className="icon">↑</div><p>No contributions found</p></div>
              </td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.memberName}</td>
                <td style={{ fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>{c.month}</td>
                <td style={{ fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{fmt(c.amount)}</td>
                <td style={{ color: 'var(--muted)' }}>{c.date}</td>
                <td>
                  {c.status === 'approved'
                    ? <span className="badge badge-green">Approved</span>
                    : <span className="badge badge-amber">Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Contribution</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                Members indicate they have made a payment. Signatories must approve before it reflects.
              </div>
              <div className="form-group">
                <label>Member</label>
                <select name="memberId" value={form.memberId} onChange={handle}>
                  <option value="">Select member...</option>
                  {mockMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {errors.memberId && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.memberId}</span>}
              </div>
              <div className="form-group">
                <label>Month</label>
                <select name="month" value={form.month} onChange={handle}>
                  <option value="">Select month...</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.month && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.month}</span>}
              </div>
              <div className="form-group">
                <label>Amount (BWP)</label>
                <input name="amount" type="number" value={form.amount} onChange={handle} />
                {errors.amount && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.amount}</span>}
              </div>
              <div className="form-group">
                <label>Proof of Payment (optional)</label>
                <input name="proof" placeholder="Reference number or note" value={form.proof} onChange={handle} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Submit Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}