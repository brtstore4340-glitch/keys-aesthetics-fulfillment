const _jsxFileName = "";﻿import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '@/hooks/useFirebase'
import { useAuth } from '@/contexts/AuthContext'
import { UserGrid } from '@/components/auth/UserGrid'
import { PinPad } from '@/components/auth/PinPad'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { toast } from 'sonner'

export default function StaffSelection() {
  const navigate = useNavigate()
  const { users, loading, error } = useUsers()
  const { setCurrentUser } = useAuth()
  const [selectedUser, setSelectedUser] = useState(null)

  const handleSelectUser = (user) => {
    if (!user.pin) {
      // No PIN required, login directly
      loginUser(user)
    } else {
      setSelectedUser(user)
    }
  }

  const handlePinSubmit = (pin) => {
    if (selectedUser && selectedUser.pin === pin) {
      loginUser(selectedUser)
    } else {
      toast.error('Incorrect PIN')
    }
  }

  const loginUser = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))

    // Redirect based on role
    const redirectPath = 
      user.role === 'admin' ? '/admin/dashboard' :
      user.role === 'staff' ? '/staff/dashboard' :
      '/accounting/dashboard'

    navigate(redirectPath)
    toast.success(`Welcome, ${user.name}!`)
  }

  if (loading) return React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )

  if (error) {
    return (
      React.createElement('div', { className: "min-h-screen flex items-center justify-center p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
        , React.createElement(Alert, { variant: "destructive", className: "max-w-md", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
          , React.createElement(AlertDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Error loading users: "
               , error.message
          )
        )
      )
    )
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
      , React.createElement('div', { className: "w-full max-w-5xl" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
        , selectedUser ? (
          React.createElement('div', { className: "flex justify-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
            , React.createElement(PinPad, {
              userName: selectedUser.name,
              onSubmit: handlePinSubmit,
              onCancel: () => setSelectedUser(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
            )
          )
        ) : (
          React.createElement('div', { className: "space-y-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
            , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
              , React.createElement('h1', { className: "text-4xl font-bold text-gray-900 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}, "Keys Aesthetics"

              )
              , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "Select your profile to continue"    )
            )
            , React.createElement(UserGrid, { users: users, onSelectUser: handleSelectUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
          )
        )
      )
    )
  )
}
