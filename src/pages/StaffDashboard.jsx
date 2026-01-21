import { useAuth } from '@/contexts/AuthContext'
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
  const { orders, loading } = useOrders(undefined, currentUser?.id)

  if (!currentUser) return null

  if (loading) {
    return (
      <DashboardLayout user={currentUser}>
        <LoadingSpinner />
      </DashboardLayout>
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
    <DashboardLayout user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {currentUser.name}!</h1>
            <p className="text-muted-foreground">Here's your sales overview</p>
          </div>
          <Button onClick={() => navigate('/staff/create-order')}>
            Create New Order
          </Button>
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {myOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No orders yet. Create your first order!
              </p>
            ) : (
              <div className="space-y-2">
                {myOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">฿{order.total_amount.toLocaleString()}</p>
                      <span className="text-xs capitalize">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
