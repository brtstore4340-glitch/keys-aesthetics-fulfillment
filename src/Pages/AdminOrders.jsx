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
import { toast } from 'sonner'


export default function AdminOrders() {
  const { currentUser } = useAuth()
  const { orders, loading, updateOrder } = useOrders()
  const [filterStatus, setFilterStatus] = useState('all')

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} )
      )
    )
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus })
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

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
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "All Orders" )
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "Manage customer orders"  )
          )
          , React.createElement(Select, { value: filterStatus, onValueChange: setFilterStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
            , React.createElement(SelectTrigger, { className: "w-[180px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
              , React.createElement(SelectValue, { placeholder: "Filter by status"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}} )
            )
            , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "All Orders" )
              , React.createElement(SelectItem, { value: "pending", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Pending")
              , React.createElement(SelectItem, { value: "confirmed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "Confirmed")
              , React.createElement(SelectItem, { value: "processing", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, "Processing")
              , React.createElement(SelectItem, { value: "completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, "Completed")
              , React.createElement(SelectItem, { value: "cancelled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}, "Cancelled")
            )
          )
        )

        , React.createElement('div', { className: "border rounded-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Order #" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, "Customer")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, "Phone")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "Sales Rep" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Total")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Status")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Actions")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
              , filteredOrders.length === 0 ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
                  , React.createElement(TableCell, { colSpan: 7, className: "text-center py-8 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, "No orders found"

                  )
                )
              ) : (
                filteredOrders.map((order) => (
                  React.createElement(TableRow, { key: order.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
                    , React.createElement(TableCell, { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}, order.order_number)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, order.customer_name)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, order.customer_phone)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, order.sales_rep_name || '-')
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, "฿", order.total_amount.toLocaleString())
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                      , React.createElement(Badge, { className: getStatusColor(order.status), __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                        , order.status
                      )
                    )
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
                      , React.createElement(Select, {
                        value: order.status,
                        onValueChange: (value) => handleStatusChange(order.id, value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}

                        , React.createElement(SelectTrigger, { className: "w-[130px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
                          , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 127}} )
                        )
                        , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                          , React.createElement(SelectItem, { value: "pending", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "Pending")
                          , React.createElement(SelectItem, { value: "confirmed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Confirmed")
                          , React.createElement(SelectItem, { value: "processing", __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}, "Processing")
                          , React.createElement(SelectItem, { value: "completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "Completed")
                          , React.createElement(SelectItem, { value: "cancelled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}, "Cancelled")
                        )
                      )
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
