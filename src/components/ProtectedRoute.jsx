import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages inside this route need a logged-in user. Others are sent to /login,
// and returned to the page they asked for after logging in.
export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

// Login and signup: a user who is already logged in goes straight to the app.
export function PublicOnlyRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to="/courses" replace />;
  return <Outlet />;
}
