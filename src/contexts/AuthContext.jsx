const _jsxFileName = "";import { createContext, useContext, useState, useEffect, } from 'react'








const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    React.createElement(AuthContext.Provider, { value: { currentUser, setCurrentUser, logout }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
      , children
    )
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
