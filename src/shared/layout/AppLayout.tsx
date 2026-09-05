import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { AppSidebar } from '../components/AppSidebar';

export function AppLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto bg-muted p-8">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
