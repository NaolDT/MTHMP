import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({ baseURL });

function getStoredTokens() {
  return {
    accessToken: localStorage.getItem('mthmp_access_token'),
    refreshToken: localStorage.getItem('mthmp_refresh_token'),
  };
}

function setStoredTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('mthmp_access_token', accessToken);
  if (refreshToken) localStorage.setItem('mthmp_refresh_token', refreshToken);
}

function clearStoredTokens() {
  localStorage.removeItem('mthmp_access_token');
  localStorage.removeItem('mthmp_refresh_token');
}

apiClient.interceptors.request.use((config) => {
  const { accessToken } = getStoredTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function resolvePendingQueue(newToken) {
  pendingQueue.forEach(({ resolve }) => resolve(newToken));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      clearStoredTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push({ resolve });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      setStoredTokens(data.data);
      resolvePendingQueue(data.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearStoredTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { apiClient, getStoredTokens, setStoredTokens, clearStoredTokens };