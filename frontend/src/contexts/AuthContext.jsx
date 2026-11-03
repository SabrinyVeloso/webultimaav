import { createContext, useContext, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('meu_controle_user') || 'null'));
  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('meu_controle_token', data.token);
    localStorage.setItem('meu_controle_user', JSON.stringify(data.user));
    setUser(data.user);
  }
  async function register(payload) { await api.post('/auth/register', payload); await login({ email: payload.email, senha: payload.senha }); }
  function logout() { localStorage.removeItem('meu_controle_token'); localStorage.removeItem('meu_controle_user'); setUser(null); }
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
