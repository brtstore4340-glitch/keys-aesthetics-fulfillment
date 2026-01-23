const _jsxFileName = "";
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
    React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
      , users.map((user) => (
        React.createElement(Card, {
          key: user.id,
          className: cn(
            'cursor-pointer transition-all hover:shadow-lg hover:scale-105',
            'bg-gradient-to-br from-background to-muted'
          ),
          onClick: () => onSelectUser(user), __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}

          , React.createElement(CardContent, { className: "flex flex-col items-center justify-center p-6 space-y-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
            , React.createElement(Avatar, { className: "h-20 w-20" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
              , React.createElement(AvatarImage, { src: user.avatar_url, alt: user.name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
              , React.createElement(AvatarFallback, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
                , getInitials(user.name)
              )
            )
            , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
              , React.createElement('p', { className: "font-semibold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}, user.name)
              , React.createElement('p', { className: "text-sm text-muted-foreground capitalize"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, user.role)
            )
          )
        )
      ))
    )
  )
}
