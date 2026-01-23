const _jsxFileName = "";
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'







export function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return React.createElement(Navigate, { to: "/staff-selection", replace: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} )
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const redirectPath = 
      currentUser.role === 'admin' ? '/admin/dashboard' :
      currentUser.role === 'staff' ? '/staff/dashboard' :
      '/accounting/dashboard'
    
    return React.createElement(Navigate, { to: redirectPath, replace: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
  }

  return React.createElement(React.Fragment, null, children)
}
