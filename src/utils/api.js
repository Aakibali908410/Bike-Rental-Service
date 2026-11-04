/**
 * Bikes Rental Service - Centralized API Client
 * Connects React frontend to Express + MongoDB Atlas backend
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "aliMotoToken";

/**
 * Retrieve the JWT token from localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Save the JWT token into localStorage
 */
export const saveToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
};

/**
 * Remove the JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Detect network connection errors vs HTTP status errors
 */
export const isNetworkFailure = (error) => {
  return (
    error?.isNetwork ||
    error?.name === "TypeError" ||
    /Failed to fetch|NetworkError|Network request failed/i.test(error?.message || "")
  );
};

/**
 * Generic API request handler with automatic JSON parsing and Bearer token attachment
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    const error = new Error("Unable to connect to the backend server. Please check your connection or ensure the backend is running.");
    error.isNetwork = true;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Build URL query strings safely from an object
 */
const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) searchParams.append(key, value.join(","));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Authentication API endpoints mapped to backend authController
 */
export const authAPI = {
  // POST /api/auth/register
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // POST /api/auth/login
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // GET /api/auth/me
  getMe: () => apiRequest("/auth/me"),

  // PUT /api/auth/me
  updateMe: (profileData) =>
    apiRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  // GET /api/users (Admin only)
  getUsers: () => apiRequest("/users"),

  // GET /api/users/:id (Admin only)
  getUserById: (id) => apiRequest(`/users/${id}`),

  // PUT /api/users/:id/status (Admin only)
  updateUserStatus: (id, status) =>
    apiRequest(`/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

/**
 * Bike API endpoints mapped to backend bikeController & availabilityService
 */
export const bikeAPI = {
  // GET /api/bikes with query filters
  getBikes: (filters = {}) => apiRequest(`/bikes${toQueryString(filters)}`),

  // POST /api/bikes/check-availability (Real-time single bike availability check)
  checkAvailability: (params = {}) =>
    apiRequest("/bikes/check-availability", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // GET /api/bikes/available-fleet (Real-time unreserved fleet search)
  getAvailableFleet: (filters = {}) =>
    apiRequest(`/bikes/available-fleet${toQueryString(filters)}`),

  // GET /api/bikes/:id
  getBikeById: (id) => apiRequest(`/bikes/${id}`),

  // POST /api/bikes (Admin only)
  createBike: (bikeData) =>
    apiRequest("/bikes", {
      method: "POST",
      body: JSON.stringify(bikeData),
    }),

  // PUT /api/bikes/:id (Admin only)
  updateBike: (id, bikeData) =>
    apiRequest(`/bikes/${id}`, {
      method: "PUT",
      body: JSON.stringify(bikeData),
    }),

  // DELETE /api/bikes/:id (Admin only)
  deleteBike: (id) =>
    apiRequest(`/bikes/${id}`, {
      method: "DELETE",
    }),
};

/**
 * Booking API endpoints mapped to backend bookingController
 */
export const bookingAPI = {
  // POST /api/bookings (Protected)
  createBooking: (bookingData) =>
    apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  // GET /api/bookings/mine (Protected, logged in customer)
  getMyBookings: () => apiRequest("/bookings/mine"),

  // GET /api/bookings/:bookingId (Protected)
  getBookingById: (bookingId) => apiRequest(`/bookings/${bookingId}`),

  // PUT /api/bookings/:bookingId/cancel (Protected)
  cancelBooking: (bookingId) =>
    apiRequest(`/bookings/${bookingId}/cancel`, {
      method: "PUT",
    }),

  // GET /api/bookings (Admin only)
  getAllBookings: () => apiRequest("/bookings"),

  // PUT /api/bookings/:bookingId (Admin only)
  updateBookingStatus: (bookingId, updateData) =>
    apiRequest(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    }),

  // GET /api/bookings/stats (Admin only)
  getBookingStats: () => apiRequest("/bookings/stats"),
};

/**
 * Payment API endpoints mapped to backend paymentController
 */
export const paymentAPI = {
  // POST /api/payments/create-intent (Protected)
  createIntent: (intentData) =>
    apiRequest("/payments/create-intent", {
      method: "POST",
      body: JSON.stringify(intentData),
    }),

  // POST /api/payments/verify (Protected)
  verifyPayment: (verificationData) =>
    apiRequest("/payments/verify", {
      method: "POST",
      body: JSON.stringify(verificationData),
    }),

  // GET /api/payments/booking/:bookingId (Protected)
  getPaymentByBookingId: (bookingId) =>
    apiRequest(`/payments/booking/${bookingId}`),
};

/**
 * Feedback API endpoints mapped to backend feedbackController
 */
export const feedbackAPI = {
  // POST /api/feedback (Public / Protected)
  submitFeedback: (feedbackData) =>
    apiRequest("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    }),

  // GET /api/feedback/my-feedback (Protected)
  getMyFeedback: () => apiRequest("/feedback/my-feedback"),

  // GET /api/feedback (Admin only)
  getAllFeedback: (params = {}) =>
    apiRequest(`/feedback${toQueryString(params)}`),

  // PATCH /api/feedback/:id/status (Admin only)
  updateFeedbackStatus: (id, status) =>
    apiRequest(`/feedback/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // DELETE /api/feedback/:id (Protected)
  deleteFeedback: (id) =>
    apiRequest(`/feedback/${id}`, {
      method: "DELETE",
    }),
};

/**
 * Review API endpoints mapped to backend reviewController
 */
export const reviewAPI = {
  // GET /api/reviews
  getReviews: (params = {}) =>
    apiRequest(`/reviews${toQueryString(params)}`),

  // POST /api/reviews
  createReview: (reviewData) =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
};

/**
 * Chat API endpoints mapped to backend chatController
 */
export const chatAPI = {
  // POST /api/chat/message (Public / Protected)
  sendMessage: ({ message, conversationId }) =>
    apiRequest("/chat/message", {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    }),
};

export default {
  authAPI,
  bikeAPI,
  bookingAPI,
  paymentAPI,
  feedbackAPI,
  reviewAPI,
  chatAPI,
};
