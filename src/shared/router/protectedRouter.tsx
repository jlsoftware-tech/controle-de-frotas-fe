
import useAuthStore from '@/modules/auth/store/useAuthStore';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, }: { children: ReactNode; }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to={APP_ROUTES.LOGIN} replace />;
  return <>{children}</>;
}