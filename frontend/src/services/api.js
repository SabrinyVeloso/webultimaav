import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meu_controle_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('meu_controle_token');
      localStorage.removeItem('meu_controle_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);
export default api;
