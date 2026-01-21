import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function UserGrid({ users, onSelectUser }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <Card
          key={user.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg hover:scale-105',
            'bg-gradient-to-br from-background to-muted'
          )}
          onClick={() => onSelectUser(user)}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
