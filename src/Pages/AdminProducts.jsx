const _jsxFileName = ""; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }﻿import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useProducts, useProductCategories } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'


export default function AdminProducts() {
  const { currentUser } = useAuth()
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts()
  const { categories } = useProductCategories()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    sku: '',
    in_stock: true,
    image_url: ''
  })

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
      )
    )
  }

  const handleOpenDialog = (product) => {
    if (product) {
      setEditingProduct(product)
      setFormData(product)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        sku: '',
        in_stock: true,
        image_url: ''
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
        toast.success('Product updated successfully')
      } else {
        await createProduct(formData)
        toast.success('Product created successfully')
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const getCategoryName = (categoryId) => {
    return _optionalChain([categories, 'access', _ => _.find, 'call', _2 => _2(c => c.id === categoryId), 'optionalAccess', _3 => _3.name]) || 'Unknown'
  }

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "Products")
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "Manage your product inventory"   )
          )
          , React.createElement(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
            , React.createElement(DialogTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
              , React.createElement(Button, { onClick: () => handleOpenDialog(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                , React.createElement(Plus, { className: "mr-2 h-4 w-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}} ), "Add Product"

              )
            )
            , React.createElement(DialogContent, { className: "max-w-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
              , React.createElement('form', { onSubmit: handleSubmit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
                  , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
                    , editingProduct ? 'Edit Product' : 'Add New Product'
                  )
                  , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}, "Fill in the product details below"

                  )
                )
                , React.createElement('div', { className: "grid gap-4 py-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
                    , React.createElement(Label, { htmlFor: "name", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "Product Name" )
                    , React.createElement(Input, {
                      id: "name",
                      value: formData.name,
                      onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                    , React.createElement(Label, { htmlFor: "description", __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}, "Description")
                    , React.createElement(Textarea, {
                      id: "description",
                      value: formData.description,
                      onChange: (e) => setFormData({ ...formData, description: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                    )
                  )
                  , React.createElement('div', { className: "grid grid-cols-2 gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                    , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
                      , React.createElement(Label, { htmlFor: "price", __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "Price (฿)" )
                      , React.createElement(Input, {
                        id: "price",
                        type: "number",
                        value: formData.price,
                        onChange: (e) => setFormData({ ...formData, price: parseFloat(e.target.value) }),
                        required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                      )
                    )
                    , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
                      , React.createElement(Label, { htmlFor: "sku", __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}, "SKU")
                      , React.createElement(Input, {
                        id: "sku",
                        value: formData.sku,
                        onChange: (e) => setFormData({ ...formData, sku: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
                      )
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
                    , React.createElement(Label, { htmlFor: "category", __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Category")
                    , React.createElement(Select, {
                      value: formData.category_id,
                      onValueChange: (value) => setFormData({ ...formData, category_id: value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}

                      , React.createElement(SelectTrigger, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                        , React.createElement(SelectValue, { placeholder: "Select category" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
                      )
                      , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                        , categories.map((cat) => (
                          React.createElement(SelectItem, { key: cat.id, value: cat.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
                            , cat.name
                          )
                        ))
                      )
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                    , React.createElement(Label, { htmlFor: "image_url", __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}, "Image URL" )
                    , React.createElement(Input, {
                      id: "image_url",
                      value: formData.image_url,
                      onChange: (e) => setFormData({ ...formData, image_url: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                    )
                  )
                  , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                    , React.createElement('input', {
                      type: "checkbox",
                      id: "in_stock",
                      checked: formData.in_stock,
                      onChange: (e) => setFormData({ ...formData, in_stock: e.target.checked }),
                      className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                    )
                    , React.createElement(Label, { htmlFor: "in_stock", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}, "In Stock" )
                  )
                )
                , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
                  , React.createElement(Button, { type: "button", variant: "outline", onClick: () => setIsDialogOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}, "Cancel"

                  )
                  , React.createElement(Button, { type: "submit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
                    , editingProduct ? 'Update' : 'Create'
                  )
                )
              )
            )
          )
        )

        , React.createElement('div', { className: "border rounded-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}, "Image")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "Name")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}, "Category")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}, "SKU")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}, "Price")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}, "Stock")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}, "Actions")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
              , products.length === 0 ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
                  , React.createElement(TableCell, { colSpan: 7, className: "text-center py-8 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, "No products yet. Add your first product"

                  )
                )
              ) : (
                products.map((product) => (
                  React.createElement(TableRow, { key: product.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
                      , product.image_url ? (
                        React.createElement('img', { src: product.image_url, alt: product.name, className: "h-12 w-12 object-cover rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}} )
                      ) : (
                        React.createElement('div', { className: "h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, "No Image"

                        )
                      )
                    )
                    , React.createElement(TableCell, { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}, product.name)
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, getCategoryName(product.category_id))
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, product.sku || '-')
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}, "฿", product.price.toLocaleString())
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
                      , React.createElement(Badge, { variant: product.in_stock ? 'default' : 'destructive', __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
                        , product.in_stock ? 'In Stock' : 'Out of Stock'
                      )
                    )
                    , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
                      , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
                        , React.createElement(Button, {
                          size: "sm",
                          variant: "outline",
                          onClick: () => handleOpenDialog(product), __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}

                          , React.createElement(Pencil, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}} )
                        )
                        , React.createElement(Button, {
                          size: "sm",
                          variant: "destructive",
                          onClick: () => handleDelete(product.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}

                          , React.createElement(Trash2, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}} )
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
