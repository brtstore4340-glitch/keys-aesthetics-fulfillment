import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Pages
import StaffSelection from './pages/StaffSelection';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import StaffDashboard from './pages/StaffDashboard';
import StaffOrders from './pages/StaffOrders';
import CreateOrder from './pages/CreateOrder';
import AccountingDashboard from './pages/AccountingDashboard';
import AccountingOrders from './pages/AccountingOrders';
function App() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/staff-selection" replace />} />
          <Route path="/staff-selection" element={<StaffSelection />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}>
                <AdminProducts />
              </ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}>
                <AdminCategories />
              </ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>} />

          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>} />
          <Route path="/staff/orders" element={<ProtectedRoute allowedRoles={['staff']}>
                <StaffOrders />
              </ProtectedRoute>} />
          <Route path="/staff/create-order" element={<ProtectedRoute allowedRoles={['staff']}>
                <CreateOrder />
              </ProtectedRoute>} />

          {/* Accounting Routes */}
          <Route path="/accounting/dashboard" element={<ProtectedRoute allowedRoles={['accounting']}>
                <AccountingDashboard />
              </ProtectedRoute>} />
          <Route path="/accounting/orders" element={<ProtectedRoute allowedRoles={['accounting']}>
                <AccountingOrders />
              </ProtectedRoute>} />

          {/* Catch all - redirect to staff selection */}
          <Route path="*" element={<Navigate to="/staff-selection" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>;
}
export default App;