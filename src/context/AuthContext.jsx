import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('cookbook_user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('cookbook_user', JSON.stringify(user))
    else localStorage.removeItem('cookbook_user')
  }, [user])

  async function login(email, password) {
    const { data } = await api.get(`/users`, { params: { email } })
    const u = data.find(x => x.email === email && x.password === password)
    if (!u) throw new Error('Invalid credentials')
    setUser(u)
    return u
  }

  async function signup({ name, email, password }) {
    const { data: existing } = await api.get(`/users`, { params: { email } })
    if (existing.length) throw new Error('Email already registered')
    const { data: u } = await api.post('/users', { name, email, password })
    setUser(u)
    return u
  }

  function logout() { setUser(null) }

  const value = { user, login, signup, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }