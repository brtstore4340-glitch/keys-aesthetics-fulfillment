const _jsxFileName = "";﻿import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'







export function PinPad({ onSubmit, onCancel, userName }) {
  const [pin, setPin] = useState('')

  const handleNumberClick = (num) => {
    if (pin.length < 6) {
      setPin(pin + num)
    }
  }

  const handleClear = () => {
    setPin('')
  }

  const handleSubmit = () => {
    if (pin.length >= 4) {
      onSubmit(pin)
    }
  }

  return (
    React.createElement(Card, { className: "w-full max-w-md" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
      , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
            , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}, "Enter PIN" )
            , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, userName)
          )
          , React.createElement(Button, { variant: "ghost", size: "icon", onClick: onCancel, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
            , React.createElement(X, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}} )
          )
        )
      )
      , React.createElement(CardContent, { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
        , React.createElement('div', { className: "flex justify-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
          , [...Array(6)].map((_, i) => (
            React.createElement('div', {
              key: i,
              className: "h-12 w-12 rounded-lg border-2 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}

              , pin[i] && React.createElement('div', { className: "h-3 w-3 rounded-full bg-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}} )
            )
          ))
        )

        , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
          , [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            React.createElement(Button, {
              key: num,
              variant: "outline",
              size: "lg",
              onClick: () => handleNumberClick(num.toString()),
              className: "h-16 text-xl" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}

              , num
            )
          ))
          , React.createElement(Button, {
            variant: "outline",
            size: "lg",
            onClick: handleClear,
            className: "h-16", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
, "Clear"

          )
          , React.createElement(Button, {
            variant: "outline",
            size: "lg",
            onClick: () => handleNumberClick('0'),
            className: "h-16 text-xl" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
, "0"

          )
          , React.createElement(Button, {
            variant: "default",
            size: "lg",
            onClick: handleSubmit,
            className: "h-16",
            disabled: pin.length < 4, __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
, "Enter"

          )
        )
      )
    )
  )
}
