const _jsxFileName = "";import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FolderTree,
  FileText,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'





export function Sidebar({ role }) {
  const location = useLocation()

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/users', label: 'Users', icon: Users },
  ]

  const staffMenuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/staff/orders', label: 'My Orders', icon: ShoppingCart },
    { path: '/staff/create-order', label: 'Create Order', icon: FileText },
  ]

  const accountingMenuItems = [
    { path: '/accounting/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/accounting/orders', label: 'Orders', icon: ShoppingCart },
  ]

  const menuItems = 
    role === 'admin' ? adminMenuItems :
    role === 'staff' ? staffMenuItems :
    accountingMenuItems

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    window.location.href = '/staff-selection'
  }

  return (
    React.createElement('div', { className: "flex h-full w-64 flex-col border-r bg-background"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
      , React.createElement('div', { className: "flex h-16 items-center border-b px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
        , React.createElement('h1', { className: "text-xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Keys Aesthetics" )
      )

      , React.createElement('div', { className: "flex-1 overflow-auto py-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
        , React.createElement('nav', { className: "space-y-1 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
          , menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              React.createElement(Link, {
                key: item.path,
                to: item.path,
                className: cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}

                , React.createElement(Icon, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
                , item.label
              )
            )
          })
        )
      )

      , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )

      , React.createElement('div', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
        , React.createElement(Button, {
          variant: "ghost",
          className: "w-full justify-start" ,
          onClick: handleLogout, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}

          , React.createElement(LogOut, { className: "mr-2 h-4 w-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} ), "Logout"

        )
      )
    )
  )
}
