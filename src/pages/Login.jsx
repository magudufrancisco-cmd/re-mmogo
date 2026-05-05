import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-left">
        <h1>Re-Mmogo<br />Motshelo</h1>
        <p>A smart way to manage your savings group — contributions, loans, approvals and reports all in one place.</p>
        <div className="feature-list">
          {['Track monthly contributions', 'Manage member loans', 'Signatory approvals', 'Year-end reports'].map(f => (
            <div className="feature" key={f}>
              <div className="feature-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <h2>Welcome back</h2>
        <p className="sub">Sign in to your group account</p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          New group?{' '}
          <Link to="/register-group" style={{ color: 'var(--brand)', fontWeight: 500 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}