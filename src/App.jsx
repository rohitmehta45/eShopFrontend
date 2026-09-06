import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import CustomerLayout from './components/layout/CustomerLayout';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import MyReviews from './pages/MyReviews';
import Support from './pages/Support';

import CustomerRoute from './components/CustomerRoute';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminCategories from './pages/admin/AdminCategories';
import AdminInventory from './pages/admin/AdminInventory';
import AdminWarehouses from './pages/admin/AdminWarehouses';
import AdminPayments from './pages/admin/AdminPayments';
import AdminNotifications from './pages/admin/AdminNotifications';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Routes>

              <Route element={<CustomerLayout />}>
                <Route
                  path="/"
                  element={<Home />}
                />

                <Route
                  path="/products"
                  element={<Products />}
                />

                <Route
                  path="/products/:id"
                  element={<ProductDetails />}
                />

                <Route element={<CustomerRoute />}>
                  <Route
                    path="/cart"
                    element={<Cart />}
                  />

                  <Route
                    path="/checkout"
                    element={<Checkout />}
                  />

                  <Route
                    path="/payment-result"
                    element={<PaymentResult />}
                  />

                  <Route
                    path="/orders"
                    element={<Orders />}
                  />

                  <Route
                    path="/orders/:id"
                    element={<Orders />}
                  />

                  <Route
                    path="/profile"
                    element={<Profile />}
                  />

                  <Route
                    path="/wishlist"
                    element={<Wishlist />}
                  />

                  <Route
                    path="/notifications"
                    element={<Notifications />}
                  />

                  <Route
                    path="/support"
                    element={<Support />}
                  />

                  <Route
                    path="/my-reviews"
                    element={<MyReviews />}
                  />
                </Route>

                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/register"
                  element={<Register />}
                />
              </Route>

              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>

                  <Route
                    path="/admin"
                    element={<AdminDashboard />}
                  />

                  <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                  />

                  <Route
                    path="/admin/products/new"
                    element={<AdminProductForm />}
                  />

                  <Route
                    path="/admin/products/:id/edit"
                    element={<AdminProductForm />}
                  />

                  <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                  />

                  <Route
                    path="/admin/inventory"
                    element={<AdminInventory />}
                  />

                  <Route
                    path="/admin/warehouses"
                    element={<AdminWarehouses />}
                  />

                  <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                  />

                  <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                  />

                  <Route
                    path="/admin/orders/:id"
                    element={<AdminOrderDetails />}
                  />

                  <Route
                    path="/admin/payments"
                    element={<AdminPayments />}
                  />

                  <Route
                    path="/admin/notifications"
                    element={<AdminNotifications />}
                  />

                  <Route
                    path="/admin/analytics"
                    element={<AdminAnalytics />}
                  />

                  <Route
                    path="/admin/reviews"
                    element={<AdminReviews />}
                  />

                  <Route
                    path="/admin/feedback"
                    element={<AdminFeedback />}
                  />

                  <Route
                    path="/admin/settings"
                    element={<AdminSettings />}
                  />

                </Route>
              </Route>

              <Route
                path="*"
                element={
                  <div className="container-custom min-h-screen py-20 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      404
                    </p>

                    <h1 className="font-display mt-3 text-4xl">
                      Page not found
                    </h1>

                    <p className="mt-3 text-[var(--color-text-secondary)]">
                      We couldn’t find that page.
                    </p>

                    <a
                      href="/"
                      className="btn-primary mt-6 inline-flex"
                    >
                      Back home
                    </a>
                  </div>
                }
              />

            </Routes>

            <Toaster
              position="top-right"
              reverseOrder={false}
            />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}