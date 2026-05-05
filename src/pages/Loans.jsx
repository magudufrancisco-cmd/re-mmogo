import { useState } from 'react'

const INTEREST_RATE = 0.20 // 20% per month on balance

const mockMembers = [
  { id: 1, name: 'Thabo Mokoena' },
  { id: 2, name: 'Kefilwe Sithole' },
  { id: 3, name: 'Mpho Dlamini' },
  { id: 4, name: 'Boitumelo Nkosi' },
  { id: 5, name: 'Lesego Motsepe' },
  { id: 6, name: 'Dineo Khumalo' },
]

const initLoans = [
  {
    id: 1, memberId: 2, memberName: 'Kefilwe Sithole',
    principal: 5000, balance: 5000, interestDue: 1000,
    dateTaken: '2025-03-01', status: 'approved', payments: [],
  },
  {
    id: 2, memberId: 4, memberName: 'Boitumelo Nkosi',
    principal: 8000, balance: 6800, interestDue: 1360,
    dateTaken: '2025-02-01', status: 'approved', payments: [
      { id: 101, amount: 1200, date: '2025-03-05', status: 'approved' },
    ],
  },
  {
    id: 3, memberId: 5, memberName: 'Lesego Motsepe',
    principal: 3000, balance: 3000, interestDue: 600,
    dateTaken: '2025-05-01', status: 'pending', payments: [],
  },
]

const fmt = n => `P ${Number(n).toLocaleString()}`
const emptyLoan = { memberId: '', principal: '', reason: '' }
const emptyPayment = { amount: '', proof: '' }

export default function Loans() {
  const [loans, setLoans] = useState(initLoans)
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanForm, setLoanForm] = useState(emptyLoan)
  const [payForm, setPayForm] = useState(emptyPayment)
  const [loanErrors, setLoanErrors] = useState({})
  const [payErrors, setPayErrors] = useState({})
  const [filterStatus, setFilterStatus] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const handleLoan = e => setLoanForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handlePay  = e => setPayForm(f  => ({ ...f, [e.target.name]: e.target.value }))

  const validateLoan = () => {
    const e = {}
    if (!loanForm.memberId)  e.memberId  = 'Select a member'
    if (!loanForm.principal || loanForm.principal < 1) e.principal = 'Enter a valid amount'
    const hasActiveLoan = loans.find(l => l.memberId === Number(loanForm.memberId) && l.status !== 'fully_paid')
    if (hasActiveLoan) e.memberId = 'Member already has an active loan'
    setLoanErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = () => {
    const e = {}
    if (!payForm.amount || payForm.amount < 1) e.amount = 'Enter a valid amount'
    setPayErrors(e)
    return Object.keys(e).length === 0
  }

  const submitLoan = () => {
    if (!validateLoan()) return
    const member = mockMembers.find(m => m.id === Number(loanForm.memberId))
    const principal = Number(loanForm.principal)
    setLoans(ls => [...ls, {
      id: Date.now(),
      memberId: Number(loanForm.memberId),
      memberName: member.name,
      principal,
      balance: principal,
      interestDue: +(principal * INTEREST_RATE).toFixed(2),
      dateTaken: new Date().toISOString().slice(0,10),
      status: 'pending',
      payments: [],
    }])
    setShowLoanModal(false)
    setLoanForm(emptyLoan)
  }

  const submitPayment = () => {
    if (!validatePayment()) return
    const amount = Number(payForm.amount)
    setLoans(ls => ls.map(l => {
      if (l.id !== selectedLoan.id) return l
      const payment = { id: Date.now(), amount, date: new Date().toISOString().slice(0,10), status: 'pending', proof: payForm.proof }
      return { ...l, payments: [...l.payments, payment] }
    }))
    setShowPayModal(false)
    setPayForm(emptyPayment)
  }

  const openPayModal = loan => { setSelectedLoan(loan); setPayForm(emptyPayment); setPayErrors({}); setShowPayModal(true) }

  const filtered = loans.filter(l => filterStatus === 'all' || l.status === filterStatus)

  const totalOutstanding = loans.filter(l => l.status === 'approved').reduce((s,l) => s + l.balance, 0)
  const totalInterest    = loans.filter(l => l.status === 'approved').reduce((s,l) => s + l.interestDue, 0)

  const statusBadge = s => {
    if (s === 'approved')   return <span className="badge badge-green">Approved</span>
    if (s === 'pending')    return <span className="badge badge-amber">Pending</span>
    if (s === 'fully_paid') return <span className="badge badge-blue">Fully Paid</span>
    if (s === 'rejected')   return <span className="badge badge-red">Rejected</span>
    return null
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Loans</div>
          <div className="page-sub">20% interest charged on balance each month</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setLoanForm(emptyLoan); setLoanErrors({}); setShowLoanModal(true) }}>
          + Request Loan
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Outstanding</div>
          <div className="stat-value red">{fmt(totalOutstanding)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interest Due</div>
          <div className="stat-value amber">{fmt(totalInterest)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Loans</div>
          <div className="stat-value">{loans.filter(l => l.status === 'approved').length}</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="form-group" style={{ minWidth: 180 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Member</th>
              <th>Principal</th>
              <th>Balance</th>
              <th>Monthly Interest</th>
              <th>Date Taken</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8}>
                <div className="empty-state"><div className="icon">▤</div><p>No loans found</p></div>
              </td></tr>
            )}
            {filtered.map(l => (
              <>
                <tr key={l.id}>
                  <td>
                    <button
                      className="btn btn-sm btn-ghost"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                      onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                    >
                      {expanded === l.id ? '▲' : '▼'}
                    </button>
                  </td>
                  <td style={{ fontWeight: 500 }}>{l.memberName}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{fmt(l.principal)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: l.balance > 0 ? 'var(--danger)' : 'var(--brand)' }}>{fmt(l.balance)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--warning)' }}>{fmt(l.interestDue)}</td>
                  <td style={{ color: 'var(--muted)' }}>{l.dateTaken}</td>
                  <td>{statusBadge(l.status)}</td>
                  <td>
                    {l.status === 'approved' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => openPayModal(l)}>Make Payment</button>
                    )}
                  </td>
                </tr>
                {/* Payment history row */}
                {expanded === l.id && (
                  <tr key={`${l.id}-payments`}>
                    <td colSpan={8} style={{ background: 'var(--bg-3)', padding: '0' }}>
                      <div style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                          Payment History
                        </div>
                        {l.payments.length === 0 ? (
                          <div style={{ fontSize: 13, color: 'var(--muted)' }}>No payments recorded yet.</div>
                        ) : (
                          <table style={{ width: '100%' }}>
                            <thead>
                              <tr>
                                <th style={{ fontSize: 11 }}>Amount</th>
                                <th style={{ fontSize: 11 }}>Date</th>
                                <th style={{ fontSize: 11 }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {l.payments.map(p => (
                                <tr key={p.id}>
                                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{fmt(p.amount)}</td>
                                  <td style={{ color: 'var(--muted)' }}>{p.date}</td>
                                  <td>
                                    {p.status === 'approved'
                                      ? <span className="badge badge-green">Approved</span>
                                      : <span className="badge badge-amber">Pending</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="modal-overlay" onClick={() => setShowLoanModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request a Loan</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowLoanModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                Loan requests must be approved by both signatories before disbursement. Interest is charged at 20% of balance per month.
              </div>
              <div className="form-group">
                <label>Member</label>
                <select name="memberId" value={loanForm.memberId} onChange={handleLoan}>
                  <option value="">Select member...</option>
                  {mockMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {loanErrors.memberId && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{loanErrors.memberId}</span>}
              </div>
              <div className="form-group">
                <label>Loan Amount (BWP)</label>
                <input name="principal" type="number" placeholder="e.g. 5000" value={loanForm.principal} onChange={handleLoan} />
                {loanErrors.principal && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{loanErrors.principal}</span>}
                {loanForm.principal > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--warning)' }}>
                    Monthly interest: {fmt(loanForm.principal * INTEREST_RATE)}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Reason (optional)</label>
                <input name="reason" placeholder="Brief reason for the loan" value={loanForm.reason} onChange={handleLoan} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowLoanModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitLoan}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && selectedLoan && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make Loan Payment</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowPayModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius)', padding: '12px 14px', fontSize: 13 }}>
                <div style={{ color: 'var(--muted)', marginBottom: 4 }}>Loan for <strong style={{ color: 'var(--text)' }}>{selectedLoan.memberName}</strong></div>
                <div>Balance: <strong style={{ color: 'var(--danger)', fontFamily: 'var(--mono)' }}>{fmt(selectedLoan.balance)}</strong></div>
                <div>Monthly interest: <strong style={{ color: 'var(--warning)', fontFamily: 'var(--mono)' }}>{fmt(selectedLoan.interestDue)}</strong></div>
              </div>
              <div className="alert alert-info" style={{ fontSize: 12 }}>
                Payment must be approved by signatories before it reflects on the balance.
              </div>
              <div className="form-group">
                <label>Payment Amount (BWP)</label>
                <input name="amount" type="number" placeholder="e.g. 1200" value={payForm.amount} onChange={handlePay} />
                {payErrors.amount && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{payErrors.amount}</span>}
              </div>
              <div className="form-group">
                <label>Proof of Payment (optional)</label>
                <input name="proof" placeholder="Reference number or note" value={payForm.proof} onChange={handlePay} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowPayModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitPayment}>Submit Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}