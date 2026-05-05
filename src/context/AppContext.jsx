import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [group, setGroup] = useState({ name: 'Re-Mmogo Savings Group' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

 const loginUser = async (email, password) => {
  // TODO: replace with real API call
  if (!email || !password) throw new Error('Invalid credentials.')
  const userData = { name: 'Kefilwe Sithole', email, role: 'signatory', groupName: 'Re-Mmogo Savings Group' }
  const token = 'mock-token-123'
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(userData))
  setUser(userData)
}

  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ user, group, setGroup, login: loginUser, logout: logoutUser, loginUser, logoutUser, loading }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)