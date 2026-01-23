const _jsxFileName = ""; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }﻿import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrders } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import { ShoppingCart, Clock, CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function StaffDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { orders, loading } = useOrders(undefined, _optionalChain([currentUser, 'optionalAccess', _ => _.id]))

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 20}} )
      )
    )
  }

  const myOrders = orders.filter(o => o.sales_rep_id === currentUser.id)
  const pendingOrders = myOrders.filter(o => o.status === 'pending').length
  const confirmedOrders = myOrders.filter(o => o.status === 'confirmed').length
  const completedOrders = myOrders.filter(o => o.status === 'completed').length

  const stats = [
    {
      title: 'Total Orders',
      value: myOrders.length,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Confirmed',
      value: confirmedOrders,
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ]

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Welcome, " , currentUser.name, "!")
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "Here's your sales overview"   )
          )
          , React.createElement(Button, { onClick: () => navigate('/staff/create-order'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Create New Order"

          )
        )

        , React.createElement('div', { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
          , stats.map((stat) => {
            const Icon = stat.icon
            return (
              React.createElement(Card, { key: stat.title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
                , React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
                  , React.createElement(CardTitle, { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
                    , stat.title
                  )
                  , React.createElement(Icon, { className: stat.color + ' h-4 w-4', __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}} )
                )
                , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                  , React.createElement('div', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, stat.value)
                )
              )
            )
          })
        )

        , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
            , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}, "Recent Orders" )
          )
          , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
            , myOrders.length === 0 ? (
              React.createElement('p', { className: "text-muted-foreground text-center py-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "No orders yet. Create your first order"

              )
            ) : (
              React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                , myOrders.slice(0, 5).map(order => (
                  React.createElement('div', { key: order.id, className: "flex items-center justify-between p-3 border rounded-lg"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                      , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, order.order_number)
                      , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, order.customer_name)
                    )
                    , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
                      , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "฿", order.total_amount.toLocaleString())
                      , React.createElement('span', { className: "text-xs capitalize" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, order.status)
                    )
                  )
                ))
              )
            )
          )
        )
      )
    )
  )
}
