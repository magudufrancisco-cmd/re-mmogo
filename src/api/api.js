import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- AUTH ---
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

// --- GROUP ---
export const getGroup = () => api.get('/group')
export const updateGroup = (data) => api.put('/group', data)

// --- MEMBERS ---
export const getMembers = () => api.get('/members')
export const addMember = (data) => api.post('/members', data)
export const getMember = (id) => api.get(`/members/${id}`)

// --- CONTRIBUTIONS ---
export const getContributions = () => api.get('/contributions')
export const addContribution = (data) => api.post('/contributions', data)
export const approveContribution = (id) => api.patch(`/contributions/${id}/approve`)
export const rejectContribution = (id) => api.patch(`/contributions/${id}/reject`)

// --- LOANS ---
export const getLoans = () => api.get('/loans')
export const applyLoan = (data) => api.post('/loans', data)
export const approveLoan = (id) => api.patch(`/loans/${id}/approve`)
export const rejectLoan = (id) => api.patch(`/loans/${id}/reject`)

// --- REPORTS ---
export const getYearEndReport = () => api.get('/reports/yearend')

export default api