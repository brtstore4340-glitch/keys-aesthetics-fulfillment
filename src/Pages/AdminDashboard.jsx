import { useAuth } from '@/contexts/AuthContext'
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
      <DashboardLayout user={currentUser}>
        <LoadingSpinner />
      </DashboardLayout>
    )
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const formatCurrency = (amount: number) => `฿${amount.toLocaleString()}`

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
    <DashboardLayout user={currentUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={stat.color + ' h-4 w-4'} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confirmed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{confirmedOrders}</div>
              <p className="text-xs text-muted-foreground">
                In processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
