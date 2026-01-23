const _jsxFileName = "";﻿import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountingOrders() {
  const { currentUser } = useAuth()
  const { orders, loading } = useOrders()
  const [filterStatus, setFilterStatus] = useState('all')

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
      )
    )
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  const totalRevenue = filteredOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const pendingAmount = filteredOrders
    .filter(o => o.status === 'pending')
    .reduce((sum, order) => sum + order.total_amount, 0)

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
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "Orders & Payments"  )
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Financial tracking and reports"   )
          )
          , React.createElement(Select, { value: filterStatus, onValueChange: setFilterStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
            , React.createElement(SelectTrigger, { className: "w-[180px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
              , React.createElement(SelectValue, { placeholder: "Filter by status"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
            )
            , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "All Orders" )
              , React.createElement(SelectItem, { value: "pending", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, "Pending")
              , React.createElement(SelectItem, { value: "confirmed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}, "Confirmed")
              , React.createElement(SelectItem, { value: "completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Completed")
            )
          )
        )

        , React.createElement('div', { className: "grid gap-4 md:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
          , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
              , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Completed Revenue" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
              , React.createElement('div', { className: "text-3xl font-bold text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, "฿"
                , totalRevenue.toLocaleString()
              )
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "From "
                 , filteredOrders.filter(o => o.status === 'completed').length, " orders"
              )
            )
          )

          , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
              , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Pending Payments" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
              , React.createElement('div', { className: "text-3xl font-bold text-yellow-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "฿"
                , pendingAmount.toLocaleString()
              )
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}, "From "
                 , filteredOrders.filter(o => o.status === 'pending').length, " orders"
              )
            )
          )
        )

        , React.createElement('div', { className: "border rounded-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "Order #" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, "Customer")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}, "Sales Rep" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "Subtotal")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "VAT")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Total")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Status")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Date")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
              , filteredOrders.length === 0 ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                  , React.createElement(TableCell, { colSpan: 8, className: "text-center py-8 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "No orders found"

                  )
                )
              ) : (
                filteredOrders.map((order) => (
                  React.createElement(TableRow, { key: order.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                    , React.createElement(TableCell, { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, order.order_number)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, order.customer_name)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, order.sales_rep_name || '-')
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}, "฿", order.subtotal.toLocaleString())
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "฿", order.vat_amount.toLocaleString())
                    , React.createElement(TableCell, { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "฿", order.total_amount.toLocaleString())
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                      , React.createElement(Badge, { className: getStatusColor(order.status), __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
                        , order.status
                      )
                    )
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
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
