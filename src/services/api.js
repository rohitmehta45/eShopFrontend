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

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) =>
    api.post('/auth/register', userData),

  login: (credentials) =>
    api.post('/auth/login', credentials),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', {
      email,
    }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, {
      password,
    }),
};

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
    const response = await api.get(
      '/products/categories/all'
    );

    return {
      ...response,
      data: {
        categories: response.data,
      },
    };
  },
};

export const productAPI = productsApi;

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

export const orderApi = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),

  getOrders: () =>
    api.get('/orders'),

  getPreviouslyPurchased: () =>
    api.get('/orders/previously-purchased'),

  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  getOrder: (id) =>
    api.get(`/orders/${id}`),

  cancelOrder: (id) =>
    api.put(`/orders/${id}/cancel`),
};

export const paymentApi = {
  createPaymentIntent: (paymentData) =>
    api.post(
      '/payments/create-payment-intent',
      paymentData
    ),

  initiateEsewa: (orderId) =>
    api.post(
      '/gateway-payments/esewa/initiate',
      {
        orderId,
      }
    ),

  getGatewayPaymentStatus: (orderId) =>
    api.get(
      `/gateway-payments/status/${orderId}`
    ),
};

export const recommendationApi = {
  getRecommendations: (userId) =>
    api.get(`/recommendations/${userId}`),
};

export const reviewApi = {
  getProductReviews: (productId) =>
    api.get(`/reviews/product/${productId}`),

  createReview: (review) =>
    api.post('/reviews', review),

  updateReview: (id, review) =>
    api.put(`/reviews/${id}`, review),

  deleteReview: (id) =>
    api.delete(`/reviews/${id}`),
};

export const customerApi = {
  getProfile: () =>
    api.get('/customer/me'),

  updateProfile: (data) =>
    api.put('/customer/me', data),

  uploadProfileImage: (file) => {
    const formData = new FormData();

    formData.append(
      'profileImage',
      file
    );

    return api.post(
      '/customer/me/profile-image',
      formData
    );
  },

  removeProfileImage: () =>
    api.delete(
      '/customer/me/profile-image'
    ),

  changePassword: (data) =>
    api.put(
      '/customer/me/password',
      data
    ),

  getWishlist: () =>
    api.get('/customer/wishlist'),

  addToWishlist: (id) =>
    api.post(
      `/customer/wishlist/${id}`
    ),

  removeFromWishlist: (id) =>
    api.delete(
      `/customer/wishlist/${id}`
    ),

  getAddresses: () =>
    api.get('/customer/addresses'),

  addAddress: (data) =>
    api.post(
      '/customer/addresses',
      data
    ),

  updateAddress: (id, data) =>
    api.put(
      `/customer/addresses/${id}`,
      data
    ),

  removeAddress: (id) =>
    api.delete(
      `/customer/addresses/${id}`
    ),

  sendFeedback: (data) =>
    api.post(
      '/customer/feedback',
      data
    ),

  getNotifications: () =>
    api.get(
      '/customer/notifications'
    ),

  getUnreadNotificationCount: () =>
    api.get(
      '/customer/notifications/unread-count'
    ),

  markNotificationRead: (id) =>
    api.patch(
      `/customer/notifications/${id}/read`
    ),

  markNotificationsRead: () =>
    api.put(
      '/customer/notifications/read-all'
    ),

  deleteNotification: (id) =>
    api.delete(
      `/customer/notifications/${id}`
    ),

  getPurchases: () =>
    api.get(
      '/orders/previously-purchased'
    ),

  getReviews: () =>
    api.get(
      '/customer/reviews'
    ),
};

export default api;