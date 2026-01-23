import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrders } from '@/hooks/useFirebase';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
export default function StaffOrders() {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const {
    orders,
    loading
  } = useOrders(undefined, currentUser?.id);
  if (!currentUser) return null;
  if (loading) {
    return <DashboardLayout user={currentUser}>
        <LoadingSpinner />
      </DashboardLayout>;
  }
  const myOrders = orders.filter(o => o.sales_rep_id === currentUser.id);
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <DashboardLayout user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Track your sales orders</p>
          </div>
          <Button onClick={() => navigate('/staff/create-order')}>
            Create New Order
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myOrders.length === 0 ? <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders yet. Create your first order!
                  </TableCell>
                </TableRow> : myOrders.map(order => <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.customer_phone}</TableCell>
                    <TableCell>฿{order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.createdAt && new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>;
}