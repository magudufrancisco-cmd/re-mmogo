import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Group from './pages/Group'
import Members from './pages/Members'
import Contributions from './pages/Contributions'
import Loans from './pages/Loans'
import Approvals from './pages/Approvals'
import Reports from './pages/Reports'

const Layout = ({ children }) => (
  <div className="app">
    <Sidebar />
    <div className="main">
      <Topbar />
      <div className="content">{children}</div>
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp()
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

const AppRoutes = () => {
  const { user } = useApp()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register-group" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
      <Route path="/contributions" element={<ProtectedRoute><Contributions /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
      <Route path="/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}