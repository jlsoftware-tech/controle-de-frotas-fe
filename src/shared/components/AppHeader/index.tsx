import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Separator } from '@/shared/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { NAVIGATION_ITEMS } from '@/shared/constants/navigation';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import useAuthStore from '@/modules/auth/store/useAuthStore';

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  let breadcrumbs: { title: string; url: string }[] = [];
  for (const item of NAVIGATION_ITEMS) {
    if (item.url === location.pathname) {
      breadcrumbs = [{ title: item.title, url: item.url }];
      break;
    }
    if (item.items) {
      const subItem = item.items.find((sub) => sub.url === location.pathname);
      if (subItem) {
        breadcrumbs = [
          { title: item.title, url: item.url },
          { title: subItem.title, url: subItem.url },
        ];
        break;
      }
    }
  }

  if (breadcrumbs.length === 0)
    breadcrumbs = [{ title: 'Dashboard', url: '/' }];

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-6 transition-all">
      <SidebarTrigger className="-ml-2 hover:bg-muted text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="mr-2" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((bc, index) => (
            <React.Fragment key={bc.title + index}>
              <BreadcrumbItem className={index === 0 && breadcrumbs.length > 1 ? "hidden md:block" : ""}>
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
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Administrador'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || 'admin@jlsoftware.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to={APP_ROUTES.PROFILE} className="flex items-center w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                logout();
                navigate(APP_ROUTES.LOGIN);
              }}
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
