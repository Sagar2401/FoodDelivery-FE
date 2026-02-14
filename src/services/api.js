import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const token = localStorage.getItem("token");

    if (error.response?.status === 401 && token && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export const menuService = {
  getAll: (params) =>
    api.get("/menu", {
      params: { category: params?.category, search: params?.search },
    }),
  getCategories: () => api.get("/menu/categories"),
  getById: (id) => api.get(`/menu/${id}`),
};

export const orderService = {
  create: (orderData) => api.post("/orders", orderData),
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getHistory: () => api.get("/orders/history"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData) => api.patch("/auth/profile", userData),
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },
};

export default api;
