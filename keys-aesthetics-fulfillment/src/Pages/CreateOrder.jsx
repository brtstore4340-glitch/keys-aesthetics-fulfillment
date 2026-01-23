import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProducts, useProductCategories, useOrders } from '@/hooks/useFirebase';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Minus, Trash2 } from 'lucide-react';
export default function CreateOrder() {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const {
    products,
    loading: productsLoading
  } = useProducts();
  const {
    categories,
    loading: categoriesLoading
  } = useProductCategories();
  const {
    createOrder
  } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);
  if (!currentUser) return null;
  if (productsLoading || categoriesLoading) {
    return <DashboardLayout user={currentUser}>
        <LoadingSpinner />
      </DashboardLayout>;
  }
  const filteredProducts = selectedCategory === 'all' ? products : products.filter(p => p.category_id === selectedCategory);
  const addToOrder = productId => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existingItem = orderItems.find(item => item.product_id === productId);
    if (existingItem) {
      setOrderItems(orderItems.map(item => item.product_id === productId ? {
        ...item,
        quantity: item.quantity + 1,
        total: (item.quantity + 1) * item.price
      } : item));
    } else {
      setOrderItems([...orderItems, {
        product_id: productId,
        product_name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };
  const updateQuantity = (productId, change) => {
    setOrderItems(orderItems.map(item => {
      if (item.product_id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.price
        };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };
  const removeItem = productId => {
    setOrderItems(orderItems.filter(item => item.product_id !== productId));
  };
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = subtotal * 0.07;
  const totalAmount = subtotal + vatAmount;
  const handleSubmit = async e => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    try {
      const orderNumber = `ORD-${Date.now()}`;
      await createOrder({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        items: orderItems,
        subtotal,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        status: 'pending',
        notes,
        sales_rep_id: currentUser.id,
        sales_rep_name: currentUser.name
      });
      toast.success('Order created successfully!');
      navigate('/staff/orders');
    } catch (error) {
      toast.error('Failed to create order');
    }
  };
  return <DashboardLayout user={currentUser}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Order</h1>
            <p className="text-muted-foreground">Fill in customer and product details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input id="customerPhone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="customerAddress">Address</Label>
                    <Textarea id="customerAddress" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Select Products</CardTitle>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(product => <div key={product.id} className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToOrder(product.id)}>
                        {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-24 object-cover rounded mb-2" />}
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">฿{product.price.toLocaleString()}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.length === 0 ? <p className="text-center text-muted-foreground py-4">
                      No items added yet
                    </p> : <>
                      <div className="space-y-2">
                        {orderItems.map(item => <div key={item.product_id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                ฿{item.price.toLocaleString()} each
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button type="button" size="sm" variant="outline" onClick={() => updateQuantity(item.product_id, -1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button type="button" size="sm" variant="outline" onClick={() => updateQuantity(item.product_id, 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(item.product_id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>)}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>฿{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT (7%)</span>
                          <span>฿{vatAmount.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>฿{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Create Order
                      </Button>
                    </>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>;
}