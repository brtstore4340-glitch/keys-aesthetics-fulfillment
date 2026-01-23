const _jsxFileName = "";
import { Sidebar } from './Sidebar'







export function DashboardLayout({ children, user }) {
  return (
    React.createElement('div', { className: "flex h-screen overflow-hidden"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      , React.createElement(Sidebar, { role: user.role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}} )
      , React.createElement('div', { className: "flex flex-1 flex-col overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement('header', { className: "flex h-16 items-center border-b px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
          , React.createElement('div', { className: "flex items-center gap-4 ml-auto"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
              , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}, user.name)
              , React.createElement('p', { className: "text-xs text-muted-foreground capitalize"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}, user.role)
            )
          )
        )
        , React.createElement('main', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
          , children
        )
      )
    )
  )
}
