import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import useUserStore from '@/modules/login/store/useAuthStore';
import { useValidateToken } from '@/modules/login/hooks/useValidateToken';
import Loading from '@/shared/components/Loading';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useUserStore((s) => s.token);
  const logout = useUserStore((s) => s.logout);

  const { data: response, isLoading } = useValidateToken();

  if (isLoading) return <Loading />;

  const isValid = response?.success && response?.data?.valid;

  if (!token || !isValid) {
    if (token && !isValid) logout();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);

  if (!token) return <Navigate to="/login" replace />;
  if (!user || !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;
  return <>{children}</>;
}
