const _jsxFileName = "";﻿import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useProductCategories } from '@/hooks/useFirebase'
import { LoadingSpinner } from '@/components/ui/spinner'








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
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'


export default function AdminCategories() {
  const { currentUser } = useAuth()
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useProductCategories()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    sort_order: 0
  })

  if (!currentUser) return null

  if (loading) {
    return (
      React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
        , React.createElement(LoadingSpinner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 48}} )
      )
    )
  }

  const handleOpenDialog = (category) => {
    if (category) {
      setEditingCategory(category)
      setFormData(category)
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        image_url: '',
        sort_order: 0
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
        toast.success('Category updated successfully')
      } else {
        await createCategory(formData)
        toast.success('Category created successfully')
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id)
        toast.success('Category deleted successfully')
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
  }

  return (
    React.createElement(DashboardLayout, { user: currentUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
            , React.createElement('h1', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Categories")
            , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, "Manage product categories"  )
          )
          , React.createElement(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
            , React.createElement(DialogTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
              , React.createElement(Button, { onClick: () => handleOpenDialog(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
                , React.createElement(Plus, { className: "mr-2 h-4 w-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}} ), "Add Category"

              )
            )
            , React.createElement(DialogContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
              , React.createElement('form', { onSubmit: handleSubmit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
                , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
                  , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
                    , editingCategory ? 'Edit Category' : 'Add New Category'
                  )
                  , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "Fill in the category details below"

                  )
                )
                , React.createElement('div', { className: "grid gap-4 py-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
                    , React.createElement(Label, { htmlFor: "name", __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Category Name" )
                    , React.createElement(Input, {
                      id: "name",
                      value: formData.name,
                      onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                    , React.createElement(Label, { htmlFor: "description", __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}, "Description")
                    , React.createElement(Textarea, {
                      id: "description",
                      value: formData.description,
                      onChange: (e) => setFormData({ ...formData, description: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                    , React.createElement(Label, { htmlFor: "image_url", __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}, "Image URL" )
                    , React.createElement(Input, {
                      id: "image_url",
                      value: formData.image_url,
                      onChange: (e) => setFormData({ ...formData, image_url: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
                    )
                  )
                  , React.createElement('div', { className: "grid gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
                    , React.createElement(Label, { htmlFor: "sort_order", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}, "Sort Order" )
                    , React.createElement(Input, {
                      id: "sort_order",
                      type: "number",
                      value: formData.sort_order,
                      onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                    )
                  )
                )
                , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
                  , React.createElement(Button, { type: "button", variant: "outline", onClick: () => setIsDialogOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "Cancel"

                  )
                  , React.createElement(Button, { type: "submit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                    , editingCategory ? 'Update' : 'Create'
                  )
                )
              )
            )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
          , categories.length === 0 ? (
            React.createElement('div', { className: "col-span-full text-center py-12 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}, "No categories yet. Add your first category"

            )
          ) : (
            categories.map((category) => (
              React.createElement('div', { key: category.id, className: "border rounded-lg p-4 space-y-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                , category.image_url && (
                  React.createElement('img', { src: category.image_url, alt: category.name, className: "w-full h-32 object-cover rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  , React.createElement('h3', { className: "font-semibold text-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, category.name)
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}, category.description)
                )
                , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                  , React.createElement(Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => handleOpenDialog(category), __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

                    , React.createElement(Pencil, { className: "h-4 w-4 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}} ), "Edit"

                  )
                  , React.createElement(Button, {
                    size: "sm",
                    variant: "destructive",
                    onClick: () => handleDelete(category.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}

                    , React.createElement(Trash2, { className: "h-4 w-4 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} ), "Delete"

                  )
                )
              )
            ))
          )
        )
      )
    )
  )
}
