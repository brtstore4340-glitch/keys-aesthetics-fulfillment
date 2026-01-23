const _jsxFileName = "";﻿import { cn } from '@/lib/utils'






export function Spinner({ className, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  return (
    React.createElement('div', {
      className: cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        className
      ),
      role: "status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}

      , React.createElement('span', { className: "!absolute-m-pxh-pxw-pxoverflow-hiddenwhitespace-nowrapborder-0 !p-0 ![clip:rect(0,0,0,0)]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "Loading..."

      )
    )
  )
}

export function LoadingSpinner() {
  return (
    React.createElement('div', { className: "flex items-center justify-center min-h-[400px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
      , React.createElement(Spinner, { size: "lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
    )
  )
}
