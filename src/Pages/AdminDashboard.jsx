const _jsxFileName = "";import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrders, useProducts, useProductCategories } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Package, ShoppingCart, FolderTree, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const { orders, loading: ordersLoading } = useOrders()
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useProductCategories()

  if (!currentUser) return null

  if (ordersLoading || productsLoading || categoriesLoading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} )
      )
    )
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderTree,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
          , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Admin Dashboard" )
          , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Overview of your business"   )
        )

        , React.createElement('div', { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
          , stats.map((stat) => {
            const Icon = stat.icon
            return (
              React.createElement(Card, { key: stat.title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
                , React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
                  , React.createElement(CardTitle, { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
                    , stat.title
                  )
                  , React.createElement(Icon, { className: stat.color + ' h-4 w-4', __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} )
                )
                , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                  , React.createElement('div', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, stat.value)
                )
              )
            )
          })
        )

        , React.createElement('div', { className: "grid gap-4 md:grid-cols-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
          , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
              , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}, "Pending Orders" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
              , React.createElement('div', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, pendingOrders)
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "Awaiting confirmation"

              )
            )
          )

          , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
              , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Confirmed Orders" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
              , React.createElement('div', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}, confirmedOrders)
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "In processing"

              )
            )
          )

          , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
              , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, "Completed Orders" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement('div', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, completedOrders)
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}, "Successfully delivered"

              )
            )
          )
        )
      )
    )
  )
}
