const _jsxFileName = ""; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrders } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react'

export default function AccountingDashboard() {
  const { currentUser } = useAuth()
  const { orders, loading } = useOrders()

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}} )
      )
    )
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const pendingPayments = orders
    .filter(o => o.status === 'pending')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const monthRevenue = orders
    .filter(o => {
      const orderDate = new Date(_optionalChain([o, 'access', _ => _.createdAt, 'optionalAccess', _2 => _2.seconds]) * 1000)
      const now = new Date()
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear() &&
             o.status === 'completed'
    })
    .reduce((sum, order) => sum + order.total_amount, 0)

  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: formatCurrency(monthRevenue),
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(pendingPayments),
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      title: 'Completed Orders',
      value: orders.filter(o => o.status === 'completed').length,
      icon: CreditCard,
      color: 'text-purple-600'
    }
  ]

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
          , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}, "Accounting Dashboard" )
          , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Financial overview and reports"   )
        )

        , React.createElement('div', { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
          , stats.map((stat) => {
            const Icon = stat.icon
            return (
              React.createElement(Card, { key: stat.title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                , React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
                  , React.createElement(CardTitle, { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                    , stat.title
                  )
                  , React.createElement(Icon, { className: stat.color + ' h-4 w-4', __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} )
                )
                , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
                  , React.createElement('div', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, stat.value)
                )
              )
            )
          })
        )
      )
    )
  )
}
