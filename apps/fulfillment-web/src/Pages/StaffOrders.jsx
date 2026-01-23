const _jsxFileName = ""; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }﻿import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useOrders } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function StaffOrders() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { orders, loading } = useOrders(undefined, _optionalChain([currentUser, 'optionalAccess', _ => _.id]))

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} )
      )
    )
  }

  const myOrders = orders.filter(o => o.sales_rep_id === currentUser.id)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "My Orders" )
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "Track your sales orders"   )
          )
          , React.createElement(Button, { onClick: () => navigate('/staff/create-order'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Create New Order"

          )
        )

        , React.createElement('div', { className: "border rounded-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Order #" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "Customer")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "Phone")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Total")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Status")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "Date")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
              , myOrders.length === 0 ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
                  , React.createElement(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}, "No orders yet. Create your first order"

                  )
                )
              ) : (
                myOrders.map((order) => (
                  React.createElement(TableRow, { key: order.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
                    , React.createElement(TableCell, { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, order.order_number)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, order.customer_name)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, order.customer_phone)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}, "฿", order.total_amount.toLocaleString())
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
                      , React.createElement(Badge, { className: getStatusColor(order.status), __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                        , order.status
                      )
                    )
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
                      , order.createdAt && new Date(order.createdAt.seconds * 1000).toLocaleDateString()
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
