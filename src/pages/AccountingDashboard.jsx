import { useAuth } from '@/contexts/AuthContext'
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
      <DashboardLayout user={currentUser}>
        <LoadingSpinner />
      </DashboardLayout>
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
      const orderDate = new Date(o.createdAt?.seconds * 1000)
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
    <DashboardLayout user={currentUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Accounting Dashboard</h1>
          <p className="text-muted-foreground">Financial overview and reports</p>
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
      </div>
    </DashboardLayout>
  )
}
