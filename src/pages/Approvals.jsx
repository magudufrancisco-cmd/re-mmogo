import { useState } from 'react'

const mockUser = { id: 2, name: 'Kefilwe Sithole', role: 'signatory' }

const initItems = [
  {
    id: 1, type: 'loan', memberId: 5, memberName: 'Lesego Motsepe',
    amount: 3000, date: '2025-05-01', description: 'Loan request — P3,000',
    approvals: [], status: 'pending',
  },
  {
    id: 2, type: 'loan_payment', memberId: 4, memberName: 'Boitumelo Nkosi',
    amount: 1200, date: '2025-05-04', description: 'Loan repayment — P1,200',
    approvals: [{ signatoryId: 2, signatoryName: 'Kefilwe Sithole', action: 'approved', date: '2025-05-04' }],
    status: 'pending',
  },
  {
    id: 3, type: 'contribution', memberId: 4, memberName: 'Boitumelo Nkosi',
    amount: 1000, date: '2025-05-07', description: 'Monthly contribution — May 2025',
    approvals: [], status: 'pending',
  },
  {
    id: 4, type: 'loan', memberId: 3, memberName: 'Mpho Dlamini',
    amount: 4000, date: '2025-04-20', description: 'Loan request — P4,000',
    approvals: [
      { signatoryId: 2, signatoryName: 'Kefilwe Sithole', action: 'approved', date: '2025-04-21' },
      { signatoryId: 4, signatoryName: 'Boitumelo Nkosi', action: 'approved', date: '2025-04-21' },
    ],
    status: 'approved',
  },
  {
    id: 5, type: 'contribution', memberId: 6, memberName: 'Dineo Khumalo',
    amount: 1000, date: '2025-04-05', description: 'Monthly contribution — April 2025',
    approvals: [
      { signatoryId: 2, signatoryName: 'Kefilwe Sithole', action: 'rejected', date: '2025-04-06' },
    ],
    status: 'rejected',
  },
]

const fmt = n => `P ${Number(n).toLocaleString()}`

const typeBadge = type => {
  if (type === 'loan')         return <span className="badge badge-red">Loan</span>
  if (type === 'loan_payment') return <span className="badge badge-amber">Loan Payment</span>
  if (type === 'contribution') return <span className="badge badge-blue">Contribution</span>
  return null
}

const statusBadge = status => {
  if (status === 'approved') return <span className="badge badge-green">Approved</span>
  if (status === 'rejected') return <span className="badge badge-red">Rejected</span>
  return <span className="badge badge-amber">Pending</span>
}

export default function Approvals() {
  const [items, setItems] = useState(initItems)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [filterType, setFilterType] = useState('all')
  const [confirmModal, setConfirmModal] = useState(null) // { item, action }

  const currentUser = mockUser
  const isSignatory = currentUser.role === 'signatory'

  const alreadyActed = item => item.approvals.some(a => a.signatoryId === currentUser.id)

  const needsMyAction = item =>
    item.status === 'pending' && isSignatory && !alreadyActed(item)

  const act = (itemId, action) => {
    setItems(items => items.map(item => {
      if (item.id !== itemId) return item
      const newApprovals = [...item.approvals, {
        signatoryId: currentUser.id,
        signatoryName: currentUser.name,
        action,
        date: new Date().toISOString().slice(0, 10),
      }]
      // Fully approved when both signatories approved
      const approvedCount = newApprovals.filter(a => a.action === 'approved').length
      const rejectedAny   = newApprovals.some(a => a.action === 'rejected')
      const newStatus = rejectedAny ? 'rejected' : approvedCount >= 2 ? 'approved' : 'pending'
      return { ...item, approvals: newApprovals, status: newStatus }
    }))
    setConfirmModal(null)
  }

  const filtered = items.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false
    if (filterType   !== 'all' && i.type   !== filterType)   return false
    return true
  })

  const pendingCount = items.filter(i => i.status === 'pending').length
  const myPending    = items.filter(i => needsMyAction(i)).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Approvals</div>
          <div className="page-sub">Both signatories must approve for an action to take effect</div>
        </div>
        {myPending > 0 && (
          <span className="badge badge-red" style={{ fontSize: 13, padding: '6px 14px' }}>
            {myPending} awaiting your action
          </span>
        )}
      </div>

      {!isSignatory && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          ⚠ You are not a signatory. Only signatories can approve or reject items.
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value amber">{pendingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value green">{items.filter(i => i.status === 'approved').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value red">{items.filter(i => i.status === 'rejected').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ minWidth: 160 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group" style={{ minWidth: 180 }}>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="loan">Loans</option>
            <option value="loan_payment">Loan Payments</option>
            <option value="contribution">Contributions</option>
          </select>
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="icon">✓</div><p>Nothing to show</p></div>
        )}
        {filtered.map(item => {
          const myAction  = item.approvals.find(a => a.signatoryId === currentUser.id)
          const canAct    = needsMyAction(item)
          const approvedCount = item.approvals.filter(a => a.action === 'approved').length

          return (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {typeBadge(item.type)}
                    {statusBadge(item.status)}
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 15 }}>{item.memberName}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{item.description} · {item.date}</div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20, color: 'var(--text)', flexShrink: 0 }}>
                  {fmt(item.amount)}
                </div>
              </div>

              {/* Signatory approvals */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {item.approvals.map((a, i) => (
                  <div key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: a.action === 'approved' ? 'var(--brand-bg)' : 'var(--danger-bg)', color: a.action === 'approved' ? 'var(--brand)' : 'var(--danger)' }}>
                    {a.action === 'approved' ? '✓' : '✗'} {a.signatoryName}
                  </div>
                ))}
                {item.status === 'pending' && (
                  <div style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: 'var(--bg-3)', color: 'var(--muted)' }}>
                    {2 - approvedCount} more signature{2 - approvedCount !== 1 ? 's' : ''} needed
                  </div>
                )}
              </div>

              {/* Actions */}
              {canAct && (
                <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => setConfirmModal({ item, action: 'approved' })}>
                    ✓ Approve
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => setConfirmModal({ item, action: 'rejected' })}>
                    ✗ Reject
                  </button>
                </div>
              )}
              {myAction && (
                <div style={{ fontSize: 12, color: myAction.action === 'approved' ? 'var(--brand)' : 'var(--danger)', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
                  You {myAction.action} this on {myAction.date}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>{confirmModal.action === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                Are you sure you want to <strong style={{ color: confirmModal.action === 'approved' ? 'var(--brand)' : 'var(--danger)' }}>{confirmModal.action === 'approved' ? 'approve' : 'reject'}</strong> this {confirmModal.item.type.replace('_', ' ')} of <strong style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{fmt(confirmModal.item.amount)}</strong> for <strong>{confirmModal.item.memberName}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                className={`btn ${confirmModal.action === 'approved' ? 'btn-primary' : 'btn-danger'}`}
                onClick={() => act(confirmModal.item.id, confirmModal.action)}
              >
                {confirmModal.action === 'approved' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}