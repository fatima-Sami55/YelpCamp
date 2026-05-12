import axios from "axios";

// Backend Base URL
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Axios Instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// AUTH APIs
// ==============================

export const authAPI = {
  // Register User
  register: (userData) =>
    api.post("/register", userData),

  // Login User
  login: (credentials) =>
    api.post("/login", credentials),

  // Logout User
  logout: () =>
    api.get("/logout"),

  // Current Logged In User
  getCurrentUser: () =>
    api.get("/currentUser"),
};

export const configAPI = {
  getMapboxToken: () =>
    api.get("/mapbox-token"),
};

// ==============================
// CAMPGROUND APIs
// ==============================

export const campAPI = {
  // Get All Campgrounds
  getAll: () =>
    api.get("/campGround"),

  // Get Single Campground
  getById: (id) =>
    api.get(`/campGround/${id}`),

  // Create Campground
  create: (data) =>
    api.post("/campGround", data),

  // Update Campground
  update: (id, data) =>
    api.put(`/campGround/${id}`, data),

  // Delete Campground
  delete: (id) =>
    api.delete(`/campGround/${id}`),

  // Search Campgrounds
  search: (query) =>
    api.get(`/campGround?search=${query}`),
};

// ==============================
// REVIEW APIs
// ==============================

export const reviewAPI = {
  // Get Reviews for Campground
  getByCamp: (campId) =>
    api.get(`/campGround/${campId}/reviews`),

  // Create Review
  create: (campId, data) =>
    api.post(`/campGround/${campId}/reviews`, data),

  // Update Review
  update: (campId, reviewId, data) =>
    api.put(
      `/campGround/${campId}/reviews/${reviewId}`,
      data
    ),

  // Delete Review
  delete: (campId, reviewId) =>
    api.delete(
      `/campGround/${campId}/reviews/${reviewId}`
    ),
};

// ==============================
// AXIOS RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
