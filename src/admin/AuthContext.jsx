import { createContext, useContext, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sb_token'))

  const login = async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem('sb_token', data.token)
    setToken(data.token)
  }

  const logout = () => {
    localStorage.removeItem('sb_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
