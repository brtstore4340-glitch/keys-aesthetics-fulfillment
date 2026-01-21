import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '@/hooks/useFirebase'
import { useAuth } from '@/contexts/AuthContext'
import { UserGrid } from '@/components/auth/UserGrid'
import { PinPad } from '@/components/auth/PinPad'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User } from '@/types'
import { toast } from 'sonner'

export default function StaffSelection() {
  const navigate = useNavigate()
  const { users, loading, error } = useUsers()
  const { setCurrentUser } = useAuth()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleSelectUser = (user: User) => {
    if (!user.pin) {
      // No PIN required, login directly
      loginUser(user)
    } else {
      setSelectedUser(user)
    }
  }

  const handlePinSubmit = (pin: string) => {
    if (selectedUser && selectedUser.pin === pin) {
      loginUser(selectedUser)
    } else {
      toast.error('Incorrect PIN')
    }
  }

  const loginUser = (user: User) => {
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

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Error loading users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {selectedUser ? (
          <div className="flex justify-center">
            <PinPad
              userName={selectedUser.name}
              onSubmit={handlePinSubmit}
              onCancel={() => setSelectedUser(null)}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Keys Aesthetics
              </h1>
              <p className="text-gray-600">Select your profile to continue</p>
            </div>
            <UserGrid users={users} onSelectUser={handleSelectUser} />
          </div>
        )}
      </div>
    </div>
  )
}
