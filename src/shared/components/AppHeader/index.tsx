import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { LogOut, User } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import useAuthStore from '@/modules/auth/store/useAuthStore';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { getNavigation } from '@/shared/services/navigation';
import type { NavigationResponse } from '@/shared/types/navigationMenuItem';

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: logoutMutation } = useLogout();
  const toast = useToastLoading();

  const handleLogout = async () => {
    toast({ message: 'Saindo...' });
    const res = await logoutMutation();
    toast({ type: res.type, message: res.message });
    clearAuth();
    navigate(APP_ROUTES.LOGIN);
  };

  const { data: response } = useQuery({
    queryKey: ['navigation'],
    queryFn: getNavigation,
    enabled: !!user,
  });

  const navigationItems: NavigationResponse = response?.data ?? [];

  let breadcrumbs: { title: string; url: string }[] = [];
  for (const item of navigationItems) {
    if (item.nameMenu === location.pathname) {
      breadcrumbs = [{ title: item.nameMenu, url: item.link }];
      break;
    }
    if (item.subMenu) {
      const subItem = item.subMenu.find((sub) => sub.link === location.pathname);
      if (subItem) {
        breadcrumbs = [
          { title: item.nameMenu, url: item.link },
          { title: subItem.nameSubMenu, url: subItem.link },
        ];
        break;
      }
    }
  }

  if (breadcrumbs.length === 0 || location.pathname === APP_ROUTES.HOME)
    breadcrumbs = [{ title: 'Dashboard', url: APP_ROUTES.HOME }];
  else
    breadcrumbs = [
      { title: 'Dashboard', url: APP_ROUTES.HOME },
      ...breadcrumbs,
    ];

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-6 transition-all">
      <SidebarTrigger className="-ml-2 hover:bg-muted text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="mr-2" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((bc, index) => (
            <React.Fragment key={bc.title + index}>
              <BreadcrumbItem
                className={
                  index === 0 && breadcrumbs.length > 1 ? 'hidden md:block' : ''
                }
              >
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={bc.url}>{bc.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback>
                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@jlsoftware.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link
                to={APP_ROUTES.PROFILE}
                className="flex items-center w-full"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
