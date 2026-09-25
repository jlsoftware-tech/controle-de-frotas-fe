import useAuthStore from '@/modules/auth/store/useAuthStore';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, }: { children: ReactNode; }) {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token) logout();
  }, [token, logout]);

  if (!token) return <Navigate to={APP_ROUTES.LOGIN} replace />;
  return <>{children}</>;
}
