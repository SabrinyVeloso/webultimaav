import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export default function ProtectedRoute() { return useAuth().user ? <Outlet /> : <Navigate to="/login" replace />; }
