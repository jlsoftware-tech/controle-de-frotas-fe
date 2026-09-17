import useAuthStore from '@/modules/auth/store/useAuthStore';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { useMenuStore } from '@/shared/store/useMenuStore';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { AppSidebar } from '../components/AppSidebar';

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const hasFetched = useMenuStore((s) => s.hasFetched);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);

  useEffect(() => {
    if (user && !hasFetched) fetchMenu();
  }, [user, hasFetched, fetchMenu]);

  return (
    <TooltipProvider>
      <SidebarProvider className="h-svh overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto bg-muted p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
