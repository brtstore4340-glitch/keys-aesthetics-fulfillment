import { Link, useLocation } from 'react-router-dom'
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

interface SidebarProps {
  role: 'admin' | 'staff' | 'accounting'
}

export function Sidebar({ role }: SidebarProps) {
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
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Keys Aesthetics</h1>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <Separator />
      
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
