import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    api.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = api.onAuthChange((_event, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const login = (email, password) => api.login(email, password)
  const logout = () => api.logout()

  return (
    <AuthContext.Provider value={{
      session,
      isAuthed: !!session,
      isLoading: session === undefined,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
