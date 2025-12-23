import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://devsearch-njuy.onrender.com";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const isAuthEndpoint = (config.url || "").startsWith("/api/auth/");
  const token = localStorage.getItem("accessToken");
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint = (original?.url || "").startsWith("/api/auth/");
    if (
      error.response &&
      error.response.status === 401 &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      if (refreshing) throw error;
      try {
        refreshing = true;
        const r = await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
        const newToken = r.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          refreshing = false;
          return api(original);
        }
      } catch {
        refreshing = false;
      }
    }
    throw error;
  }
);

export default api;

