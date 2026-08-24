import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import useUserStore from '@/modules/login/store/useAuthStore';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useUserStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
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
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
