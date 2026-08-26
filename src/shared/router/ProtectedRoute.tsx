import { Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import useAuthStore from '@/modules/auth/store/useAuthStore';
import { useValidateToken } from '@/modules/auth/hooks/useValidateToken';
import Loading from '@/shared/components/Loading';

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  
  const { data, isLoading, isError } = useValidateToken();

  useEffect(() => {
    if (isError || (data && !data.success))
      logout();
  }, [data, isError, logout]);

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) return <Navigate to="/" replace />;
  if (isLoading) return <Loading />;

  return <>{children}</>;
}
