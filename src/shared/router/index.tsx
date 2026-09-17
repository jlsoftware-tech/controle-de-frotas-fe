import Loading from '@/shared/components/Loading';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { AppLayout } from '@/shared/layout/AppLayout';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './protectedRouter';
import { PublicRoute } from './publicRouter';

const Login = lazy(() => import('@/modules/auth/pages/Login'));
const ForgotPassword = lazy(() => import('@/modules/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/modules/auth/pages/ResetPassword'));
const UsersList = lazy(() => import('@/modules/users/pages/UsersList'));
const ProfilesList = lazy(() => import('@/modules/profiles/pages/ProfilesList'));
const SecretariatsList = lazy(() => import('@/modules/secretariats/pages/SecretariatsList'));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: APP_ROUTES.LOGIN,
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: APP_ROUTES.FORGOT_PASSWORD,
      element: <ForgotPassword />,
    },
    {
      path: APP_ROUTES.RESET_PASSWORD,
      element: <ResetPassword />,
    },
    {
      path: APP_ROUTES.HOME,
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <>essa é a home</>,
        },
        {
          path: APP_ROUTES.USERS,
          element: <UsersList />,
        },
        {
          path: APP_ROUTES.PROFILES,
          element: <ProfilesList />,
        },
        {
          path: APP_ROUTES.SECRETARIATS,
          element: <SecretariatsList />,
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Router;
