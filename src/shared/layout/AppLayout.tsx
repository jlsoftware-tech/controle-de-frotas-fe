import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { AppSidebar } from '../components/AppSidebar';
import { AppHeader } from '../components/AppHeader';

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
