import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Gate for the admin routes.
 *
 * Carries the attempted URL to the login page as `?next=`. Without it, an
 * expired session turned every bookmark and every link a colleague pasted
 * into "you are now on the dashboard" — the destination was simply dropped,
 * and the person had to navigate back by hand.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) return <>{children}</>;

  const next = encodeURIComponent(`${location.pathname}${location.search}`);
  return <Navigate to={`/login?next=${next}`} replace />;
}
