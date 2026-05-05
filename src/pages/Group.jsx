import { useState } from 'react'
import { useApp } from '../context/AppContext'

const initGroup = {
  name: 'Re-Mmogo Savings Group',
  description: 'A community savings group based in Gaborone.',
  location: 'Gaborone, Botswana',
  startDate: '2025-01-01',
  monthlyContribution: 1000,
  interestRate: 20,
  interestTarget: 5000,
}

const initSignatories = [
  { id: 2, name: 'Kefilwe Sithole',  email: 'kefilwe@email.com', phone: '72345678' },
  { id: 4, name: 'Boitumelo Nkosi', email: 'boitu@email.com',   phone: '74567890' },
]

const fmt = n => `P ${Number(n).toLocaleString()}`

export default function Group() {
  const { group: ctxGroup, setGroup: setCtxGroup } = useApp()
  const [group, setGroup]             = useState(initGroup)
  const [signatories]                 = useState(initSignatories)
  const [editing, setEditing]         = useState(false)
  const [form, setForm]               = useState(initGroup)
  const [errors, setErrors]           = useState({})
  const [saved, setSaved]             = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Group name is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (form.monthlyContribution < 1) e.monthlyContribution = 'Must be at least P1'
    if (form.interestRate < 1)        e.interestRate        = 'Must be at least 1%'
    if (form.interestTarget < 1)      e.interestTarget      = 'Must be at least P1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => {
    if (!validate()) return
    setGroup(form)
    setCtxGroup({ ...ctxGroup, name: form.name })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const cancel = () => { setForm(group); setErrors({}); setEditing(false) }

  const monthsRunning = () => {
    const start = new Date(group.startDate)
    const now   = new Date()
    return Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Group Settings</div>
          <div className="page-sub">Manage your motshelo group details and rules</div>
        </div>
        {!editing && (
          <button className="btn btn-secondary" onClick={() => { setForm(group); setEditing(true) }}>
            ✎ Edit Settings
          </button>
        )}
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          ✓ Group settings saved successfully.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Group Details */}
        <div className="card" style={{ gridColumn: editing ? '1 / -1' : 'auto' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Group Details</div>
              <div className="card-sub">Basic information about your group</div>
            </div>
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Group Name</label>
                <input name="name" value={form.name} onChange={handle} />
                {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input name="description" value={form.description} onChange={handle} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handle} />
                {errors.location && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handle} />
              </div>

              <div className="divider" />
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Financial Rules</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label>Monthly Contribution (BWP)</label>
                  <input name="monthlyContribution" type="number" value={form.monthlyContribution} onChange={handle} />
                  {errors.monthlyContribution && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.monthlyContribution}</span>}
                </div>
                <div className="form-group">
                  <label>Loan Interest Rate (%/month)</label>
                  <input name="interestRate" type="number" value={form.interestRate} onChange={handle} />
                  {errors.interestRate && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.interestRate}</span>}
                </div>
                <div className="form-group">
                  <label>Interest Target per Member (BWP)</label>
                  <input name="interestTarget" type="number" value={form.interestTarget} onChange={handle} />
                  {errors.interestTarget && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.interestTarget}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={save}>Save Changes</button>
                <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Group Name',    group.name],
                ['Description',   group.description || '—'],
                ['Location',      group.location],
                ['Start Date',    group.startDate],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Rules — view only */}
        {!editing && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Financial Rules</div>
                <div className="card-sub">Contribution and loan settings</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Monthly Contribution',   fmt(group.monthlyContribution)],
                ['Loan Interest Rate',     `${group.interestRate}% per month`],
                ['Interest Target',        `${fmt(group.interestTarget)} per member/year`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', fontFamily: 'var(--mono)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signatories */}
        {!editing && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Signatories</div>
                <div className="card-sub">Authorised approvers for this group</div>
              </div>
              <span className="badge badge-green">{signatories.length}/2 assigned</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {signatories.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < signatories.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.email} · {s.phone}</div>
                  </div>
                  <span className="badge badge-green">Signatory {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group Stats */}
        {!editing && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Group Stats</div>
                <div className="card-sub">Since {group.startDate}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Months Running',       `${monthsRunning()} months`],
                ['Members Enrolled',     '6'],
                ['Total Contributions',  fmt(62000)],
                ['Active Loans',         '2'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}