import Loading from '@/shared/components/Loading';
import React, { lazy, Suspense } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { APP_ROUTES } from '@/shared/router/urlRoutes';
// import { ProtectedRoute, RoleProtectedRoute } from "@/shared/router/ProtectedRoute";

const Home = lazy(() => import('@/modules/home/pages/Home'));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: APP_ROUTES.HOME,
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <Home />,
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
