import { useState } from 'react'

const initMock = [
  { id: 1, name: 'Thabo Mokoena',    email: 'thabo@email.com',    phone: '71234567', role: 'member',    joinDate: '2025-01-01', status: 'active' },
  { id: 2, name: 'Kefilwe Sithole',  email: 'kefilwe@email.com',  phone: '72345678', role: 'signatory', joinDate: '2025-01-01', status: 'active' },
  { id: 3, name: 'Mpho Dlamini',     email: 'mpho@email.com',     phone: '73456789', role: 'member',    joinDate: '2025-01-01', status: 'active' },
  { id: 4, name: 'Boitumelo Nkosi',  email: 'boitu@email.com',    phone: '74567890', role: 'signatory', joinDate: '2025-01-01', status: 'active' },
  { id: 5, name: 'Lesego Motsepe',   email: 'lesego@email.com',   phone: '75678901', role: 'member',    joinDate: '2025-02-01', status: 'active' },
  { id: 6, name: 'Dineo Khumalo',    email: 'dineo@email.com',    phone: '76789012', role: 'member',    joinDate: '2025-02-01', status: 'inactive' },
]

const empty = { name: '', email: '', phone: '', role: 'member' }

export default function Members() {
  const [members, setMembers] = useState(initMock)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)

  const signatories = members.filter(m => m.role === 'signatory').length

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (form.role === 'signatory' && signatories >= 2 && editId === null)
      e.role = 'Only 2 signatories allowed'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openAdd = () => { setForm(empty); setEditId(null); setErrors({}); setShowModal(true) }

  const openEdit = m => {
    setForm({ name: m.name, email: m.email, phone: m.phone, role: m.role })
    setEditId(m.id)
    setErrors({})
    setShowModal(true)
  }

  const save = () => {
    if (!validate()) return
    if (editId) {
      setMembers(ms => ms.map(m => m.id === editId ? { ...m, ...form } : m))
    } else {
      setMembers(ms => [...ms, { id: Date.now(), ...form, joinDate: new Date().toISOString().slice(0,10), status: 'active' }])
    }
    setShowModal(false)
  }

  const toggleStatus = id => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m))
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Members</div>
          <div className="page-sub">{members.length} enrolled · {signatories}/2 signatories assigned</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
      </div>

      {/* Signatory warning */}
      {signatories < 2 && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          ⚠ You need exactly 2 signatories to approve loans and payments. Currently {signatories} assigned.
        </div>
      )}

      {/* Search */}
      <div className="form-group" style={{ maxWidth: 320, marginBottom: 20 }}>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8}>
                <div className="empty-state"><div className="icon">◉</div><p>No members found</p></div>
              </td></tr>
            )}
            {filtered.map((m, i) => (
              <tr key={m.id}>
                <td style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td style={{ color: 'var(--text-2)' }}>{m.email}</td>
                <td style={{ color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{m.phone}</td>
                <td>
                  {m.role === 'signatory'
                    ? <span className="badge badge-green">Signatory</span>
                    : <span className="badge badge-muted">Member</span>}
                </td>
                <td style={{ color: 'var(--muted)' }}>{m.joinDate}</td>
                <td>
                  {m.status === 'active'
                    ? <span className="badge badge-blue">Active</span>
                    : <span className="badge badge-red">Inactive</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(m)}>Edit</button>
                    <button
                      className={`btn btn-sm ${m.status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleStatus(m.id)}
                    >
                      {m.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
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
              <h3>{editId ? 'Edit Member' : 'Add New Member'}</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" placeholder="e.g. Thabo Mokoena" value={form.name} onChange={handle} />
                {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="e.g. thabo@email.com" value={form.email} onChange={handle} />
                {errors.email && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" placeholder="e.g. 71234567" value={form.phone} onChange={handle} />
                {errors.phone && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handle}>
                  <option value="member">Member</option>
                  <option value="signatory">Signatory</option>
                </select>
                {errors.role && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.role}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? 'Save Changes' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}