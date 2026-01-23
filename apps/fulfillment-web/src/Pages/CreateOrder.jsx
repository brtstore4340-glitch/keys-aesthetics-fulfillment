const _jsxFileName = "";﻿import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useProducts, useProductCategories, useOrders } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Plus, Minus, Trash2 } from 'lucide-react'


export default function CreateOrder() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useProductCategories()
  const { createOrder } = useOrders()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [orderItems, setOrderItems] = useState([])

  if (!currentUser) return null

  if (productsLoading || categoriesLoading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 43}} )
      )
    )
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory)

  const addToOrder = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const existingItem = orderItems.find(item => item.product_id === productId)
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setOrderItems([...orderItems, {
        product_id: productId,
        product_name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }])
    }
  }

  const updateQuantity = (productId, change) => {
    setOrderItems(orderItems.map(item => {
      if (item.product_id === productId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity, total: newQuantity * item.price }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeItem = (productId) => {
    setOrderItems(orderItems.filter(item => item.product_id !== productId))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
  const vatAmount = subtotal * 0.07
  const totalAmount = subtotal + vatAmount

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (orderItems.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    try {
      const orderNumber = `ORD-${Date.now()}`
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
      })

      toast.success('Order created successfully')
      navigate('/staff/orders')
    } catch (error) {
      toast.error('Failed to create order')
    }
  }

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
      , React.createElement('form', { onSubmit: handleSubmit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
        , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Create New Order"  )
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "Fill in customer and product details"     )
          )

          , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
            , React.createElement('div', { className: "lg:col-span-2 space-y-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
              , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
                , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                  , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Customer Information" )
                )
                , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
                    , React.createElement(Label, { htmlFor: "customerName", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Customer Name *"  )
                    , React.createElement(Input, {
                      id: "customerName",
                      value: customerName,
                      onChange: (e) => setCustomerName(e.target.value),
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                    , React.createElement(Label, { htmlFor: "customerPhone", __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, "Phone Number *"  )
                    , React.createElement(Input, {
                      id: "customerPhone",
                      value: customerPhone,
                      onChange: (e) => setCustomerPhone(e.target.value),
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                    , React.createElement(Label, { htmlFor: "customerAddress", __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, "Address")
                    , React.createElement(Textarea, {
                      id: "customerAddress",
                      value: customerAddress,
                      onChange: (e) => setCustomerAddress(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
                    , React.createElement(Label, { htmlFor: "notes", __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}, "Notes")
                    , React.createElement(Textarea, {
                      id: "notes",
                      value: notes,
                      onChange: (e) => setNotes(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
                    )
                  )
                )
              )

              , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
                  , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
                    , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}, "Select Products" )
                    , React.createElement(Select, { value: selectedCategory, onValueChange: setSelectedCategory, __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                      , React.createElement(SelectTrigger, { className: "w-[200px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                        , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} )
                      )
                      , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                        , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}, "All Categories" )
                        , categories.map(cat => (
                          React.createElement(SelectItem, { key: cat.id, value: cat.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
                            , cat.name
                          )
                        ))
                      )
                    )
                  )
                )
                , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                  , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                    , filteredProducts.map(product => (
                      React.createElement('div', {
                        key: product.id,
                        className: "border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"     ,
                        onClick: () => addToOrder(product.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}

                        , product.image_url && (
                          React.createElement('img', { src: product.image_url, alt: product.name, className: "w-full h-24 object-cover rounded mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}} )
                        )
                        , React.createElement('h4', { className: "font-medium text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}, product.name)
                        , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "฿", product.price.toLocaleString())
                      )
                    ))
                  )
                )
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , React.createElement(Card, { className: "sticky top-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
                , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
                  , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, "Order Summary" )
                )
                , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                  , orderItems.length === 0 ? (
                    React.createElement('p', { className: "text-center text-muted-foreground py-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}, "No items added yet"

                    )
                  ) : (
                    React.createElement(React.Fragment, null
                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                        , orderItems.map(item => (
                          React.createElement('div', { key: item.product_id, className: "flex items-center justify-between py-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
                            , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
                              , React.createElement('p', { className: "font-medium text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}, item.product_name)
                              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "฿"
                                , item.price.toLocaleString(), " each"
                              )
                            )
                            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                              , React.createElement(Button, {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                onClick: () => updateQuantity(item.product_id, -1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}

                                , React.createElement(Minus, { className: "h-3 w-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}} )
                              )
                              , React.createElement('span', { className: "w-8 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}, item.quantity)
                              , React.createElement(Button, {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                onClick: () => updateQuantity(item.product_id, 1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}

                                , React.createElement(Plus, { className: "h-3 w-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}} )
                              )
                              , React.createElement(Button, {
                                type: "button",
                                size: "sm",
                                variant: "destructive",
                                onClick: () => removeItem(item.product_id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}

                                , React.createElement(Trash2, { className: "h-3 w-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}} )
                              )
                            )
                          )
                        ))
                      )

                      , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 268}} )

                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
                        , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "Subtotal")
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, "฿", subtotal.toLocaleString())
                        )
                        , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}, "VAT (7%)" )
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}, "฿", vatAmount.toLocaleString())
                        )
                        , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 279}} )
                        , React.createElement('div', { className: "flex justify-between font-bold text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "Total")
                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, "฿", totalAmount.toLocaleString())
                        )
                      )

                      , React.createElement(Button, { type: "submit", className: "w-full", size: "lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, "Create Order"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}
