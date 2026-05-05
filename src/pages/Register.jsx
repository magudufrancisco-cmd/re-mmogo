import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const steps = ['Group Info', 'Signatories', 'Review']

const emptyGroup = { name: '', description: '', location: '', startDate: '' }
const emptySig   = { name: '', email: '', phone: '' }

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(0)
  const [group, setGroup]       = useState(emptyGroup)
  const [sig1, setSig1]         = useState(emptySig)
  const [sig2, setSig2]         = useState(emptySig)
  const [password, setPassword] = useState({ password: '', confirm: '' })
  const [errors, setErrors]     = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleGroup = e => setGroup(g => ({ ...g, [e.target.name]: e.target.value }))
  const handleSig1  = e => setSig1(s  => ({ ...s, [e.target.name]: e.target.value }))
  const handleSig2  = e => setSig2(s  => ({ ...s, [e.target.name]: e.target.value }))
  const handlePass  = e => setPassword(p => ({ ...p, [e.target.name]: e.target.value }))

  const validateStep0 = () => {
    const e = {}
    if (!group.name.trim())      e.name      = 'Group name is required'
    if (!group.location.trim())  e.location  = 'Location is required'
    if (!group.startDate)        e.startDate = 'Start date is required'
    if (!password.password)      e.password  = 'Password is required'
    if (password.password.length < 6) e.password = 'Minimum 6 characters'
    if (password.password !== password.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep1 = () => {
    const e = {}
    const fields = ['name','email','phone']
    fields.forEach(f => {
      if (!sig1[f].trim()) e[`s1_${f}`] = 'Required'
      if (!sig2[f].trim()) e[`s2_${f}`] = 'Required'
    })
    if (sig1.email === sig2.email && sig1.email) e.s2_email = 'Must be a different person'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  const submit = () => {
    // TODO: POST to backend API
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--brand)', marginBottom: 10 }}>Group Registered!</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 28 }}>
            <strong style={{ color: 'var(--text)' }}>{group.name}</strong> has been registered successfully. You can now sign in and start managing your motshelo.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand)', letterSpacing: -0.5, marginBottom: 6 }}>Re-Mmogo</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Register your motshelo group</p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  background: i < step ? 'var(--brand)' : i === step ? 'var(--brand-bg-2)' : 'var(--bg-3)',
                  color: i < step ? '#0d1a11' : i === step ? 'var(--brand)' : 'var(--muted)',
                  border: i === step ? '2px solid var(--brand)' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? 'var(--brand)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--brand)' : 'var(--border)', margin: '0 8px', marginBottom: 18, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px 32px' }}>

          {/* Step 0: Group Info */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Group Information</h3>
              <div className="form-group">
                <label>Group Name</label>
                <input name="name" placeholder="e.g. Re-Mmogo Savings Group" value={group.name} onChange={handleGroup} />
                {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" placeholder="e.g. Gaborone, Botswana" value={group.location} onChange={handleGroup} />
                {errors.location && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input name="startDate" type="date" value={group.startDate} onChange={handleGroup} />
                {errors.startDate && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.startDate}</span>}
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <input name="description" placeholder="Brief description of your group" value={group.description} onChange={handleGroup} />
              </div>
              <div className="divider" />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Set Group Password</h3>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min. 6 characters" value={password.password} onChange={handlePass} />
                {errors.password && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirm" type="password" placeholder="Repeat password" value={password.confirm} onChange={handlePass} />
                {errors.confirm && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.confirm}</span>}
              </div>
            </div>
          )}

          {/* Step 1: Signatories */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Assign Signatories</h3>
              <div className="alert alert-info" style={{ fontSize: 13 }}>
                Two signatories are required. They will approve all loans and payments.
              </div>

              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--brand)' }}>Signatory 1</div>
              {['name','email','phone'].map(f => (
                <div className="form-group" key={`s1_${f}`}>
                  <label style={{ textTransform: 'capitalize' }}>{f}</label>
                  <input name={f} placeholder={f === 'email' ? 'email@example.com' : f === 'phone' ? '7xxxxxxx' : 'Full name'} value={sig1[f]} onChange={handleSig1} />
                  {errors[`s1_${f}`] && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors[`s1_${f}`]}</span>}
                </div>
              ))}

              <div className="divider" />

              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--brand)' }}>Signatory 2</div>
              {['name','email','phone'].map(f => (
                <div className="form-group" key={`s2_${f}`}>
                  <label style={{ textTransform: 'capitalize' }}>{f}</label>
                  <input name={f} placeholder={f === 'email' ? 'email@example.com' : f === 'phone' ? '7xxxxxxx' : 'Full name'} value={sig2[f]} onChange={handleSig2} />
                  {errors[`s2_${f}`] && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors[`s2_${f}`]}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Review & Confirm</h3>

              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: 'var(--brand)', marginBottom: 4 }}>Group Details</div>
                {[['Name', group.name], ['Location', group.location], ['Start Date', group.startDate], ['Description', group.description || '—']].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: 'var(--brand)', marginBottom: 4 }}>Signatories</div>
                {[['Signatory 1', sig1], ['Signatory 2', sig2]].map(([label, s]) => (
                  <div key={label}>
                    <div style={{ color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontWeight: 500 }}>{s.name} — {s.email} — {s.phone}</div>
                  </div>
                ))}
              </div>

              <div className="alert alert-success" style={{ fontSize: 13 }}>
                By submitting, you confirm all details are correct. The group will be created and signatories notified.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div>
              {step > 0
                ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
                : <Link to="/login" style={{ color: 'var(--muted)', fontSize: 13 }}>Already registered? Sign in</Link>}
            </div>
            {step < steps.length - 1
              ? <button className="btn btn-primary" onClick={next}>Continue →</button>
              : <button className="btn btn-primary" onClick={submit}>Register Group</button>}
          </div>
        </div>
      </div>
    </div>
  )
}