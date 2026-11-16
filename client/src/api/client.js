import axios from "axios";

// In development, Vite proxies /api -> the Express backend (see vite.config.js).
// In production, set VITE_API_BASE_URL to the deployed API's base URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const apiClient = axios.create({
  baseURL,
});

// Login token (JWT) returned by /auth/login and /auth/register. Kept in
// localStorage so the session survives a page refresh.
const TOKEN_KEY = "slaygreen_token";
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable (private mode) — session lasts until reload */ }
};

// Attach the token to every request so protected endpoints just work.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Small helper so screens can write `await api.post('/eco-hotels', {...})`
// and get back `response.data` directly, matching the shape the original
// React Native screens expected from their raw fetch() calls.
export const api = {
  get: (url, config) => apiClient.get(url, config).then((r) => r.data),
  post: (url, body, config) => apiClient.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => apiClient.put(url, body, config).then((r) => r.data),
  delete: (url, config) => apiClient.delete(url, config).then((r) => r.data),
};

export default api;
