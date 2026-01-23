const _jsxFileName = "";import React from 'react' 
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useUsers } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AdminUsers() {
  const { currentUser } = useAuth()
  const { users, loading } = useUsers()

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} )
      )
    )
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'accounting': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Users")
          , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Manage system users and permissions"    )
        )

        , React.createElement('div', { className: "border rounded-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}, "User")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}, "Email")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Role")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "Status")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
              , users.map((user) => (
                React.createElement(TableRow, { key: user.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
                  , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
                    , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
                      , React.createElement(Avatar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
                        , React.createElement(AvatarImage, { src: user.avatar_url, __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
                        , React.createElement(AvatarFallback, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}, getInitials(user.name))
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
                        , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, user.name)
                        , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}, user.id)
                      )
                    )
                  )
                  , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, user.email)
                  , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
                    , React.createElement(Badge, { className: getRoleBadgeColor(user.role), __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                      , user.role
                    )
                  )
                  , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
                    , React.createElement(Badge, { variant: "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, "Active")
                  )
                )
              ))
            )
          )
        )
      )
    )
  )
}
