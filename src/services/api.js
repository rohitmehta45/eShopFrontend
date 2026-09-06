import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.url}`
    );

    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.status} ${response.config.url}`
    );

    return response;
  },
  (error) => {
    console.error(
      '❌ API Error:',
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

// =========================
// AUTH
// =========================

export const authAPI = {
  register: (userData) =>
    api.post('/auth/register', userData),

  login: (credentials) =>
    api.post('/auth/login', credentials),
};

// =========================
// PRODUCTS
// =========================

export const productsApi = {
  getProducts: (params = {}) =>
    api.get('/products', {
      params,
    }),

  getAll: (params = {}) =>
    api.get('/products', {
      params,
    }),

  getById: (id) =>
    api.get(`/products/${id}`),

  getProduct: (id) =>
    api.get(`/products/${id}`),

  getCategories: async () => {
    const response = await api.get('/products/categories/all');
    return { ...response, data: { categories: response.data } };
  },
};

export const productAPI = productsApi;

// =========================
// CART
// =========================

export const cartApi = {
  getCart: () =>
    api.get('/cart'),

  addItem: (cartData) =>
    api.post('/cart', cartData),

  updateItem: (productId, quantity) =>
    api.put(`/cart/${productId}`, {
      quantity,
    }),

  removeItem: (productId) =>
    api.delete(`/cart/${productId}`),

  clearCart: () =>
    api.delete('/cart'),
};

// =========================
// ORDERS
// =========================

export const orderApi = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),

  getOrders: async () => {
    const response = await api.get('/orders');
    return response;
  },

  getPreviouslyPurchased: () => api.get('/orders/previously-purchased'),

  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  // Compatibility with older code
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response;
  },

  cancelOrder: (id) =>
    api.put(`/orders/${id}/cancel`),
};

// =========================
// PAYMENTS
// =========================

export const paymentApi = {
  createPaymentIntent: (paymentData) =>
    api.post(
      '/payments/create-payment-intent',
      paymentData
    ),

  initiateEsewa: (orderId) => api.post('/gateway-payments/esewa/initiate', { orderId }),
  getGatewayPaymentStatus: (orderId) => api.get(`/gateway-payments/status/${orderId}`),
};

// =========================
// RECOMMENDATIONS
// =========================

export const recommendationApi = {
  getRecommendations: (userId) =>
    api.get(`/recommendations/${userId}`),
};

export const reviewApi = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (review) => api.post('/reviews', review),
  updateReview: (id, review) => api.put(`/reviews/${id}`, review),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const customerApi = {
  getProfile: () => api.get('/customer/me'),
  updateProfile: (data) => api.put('/customer/me', data),
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    return api.post('/customer/me/profile-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  removeProfileImage: () => api.delete('/customer/me/profile-image'),
  changePassword: (data) => api.put('/customer/me/password', data),
  getWishlist: () => api.get('/customer/wishlist'),
  addToWishlist: (id) => api.post(`/customer/wishlist/${id}`),
  removeFromWishlist: (id) => api.delete(`/customer/wishlist/${id}`),
  getAddresses: () => api.get('/customer/addresses'),
  addAddress: (data) => api.post('/customer/addresses', data),
  updateAddress: (id, data) => api.put(`/customer/addresses/${id}`, data),
  removeAddress: (id) => api.delete(`/customer/addresses/${id}`),
  sendFeedback: (data) => api.post('/customer/feedback', data),
  getNotifications: () => api.get('/customer/notifications'),
  getUnreadNotificationCount: () => api.get('/customer/notifications/unread-count'),
  markNotificationRead: (id) => api.patch(`/customer/notifications/${id}/read`),
  markNotificationsRead: () => api.put('/customer/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/customer/notifications/${id}`),
  getPurchases: () => api.get('/orders/previously-purchased'),
  getReviews: () => api.get('/customer/reviews'),
};

export default api;
