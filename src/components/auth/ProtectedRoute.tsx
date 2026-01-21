import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Array<User['role']>
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/staff-selection" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const redirectPath = 
      currentUser.role === 'admin' ? '/admin/dashboard' :
      currentUser.role === 'staff' ? '/staff/dashboard' :
      '/accounting/dashboard'
    
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
