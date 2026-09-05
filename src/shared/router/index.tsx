import Loading from '@/shared/components/Loading';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { AppLayout } from '@/shared/layout/AppLayout';
import { ProtectedRoute } from '@/shared/router/ProtectedRoute';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Home = lazy(() => import('@/modules/home/pages/Home'));
const Login = lazy(() => import('@/modules/auth/pages/Login'));
const ForgotPassword = lazy(() => import('@/modules/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/modules/auth/pages/ResetPassword'));
const Profile = lazy(() => import('@/modules/profile/pages/Profile'));
const UsersList = lazy(() => import('@/modules/users/pages/UsersList'));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: APP_ROUTES.LOGIN,
      element: <Login />,
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
          element: <Home />,
        },
        {
          path: APP_ROUTES.PROFILE,
          element: <Profile />,
        },
        {
          path: APP_ROUTES.SETTINGS,
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="p-8">Configurações (Acesso restrito: ADMIN)</div>
            </ProtectedRoute>
          ),
        },
        {
          path: APP_ROUTES.USERS,
          element: (
            // <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersList />
            // </ProtectedRoute>
          ),
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
