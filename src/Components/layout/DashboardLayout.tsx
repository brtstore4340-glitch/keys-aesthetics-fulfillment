import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { User } from '@/types'

interface DashboardLayoutProps {
  children: ReactNode
  user: User
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
