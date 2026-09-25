import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { useMenuStore } from '@/shared/store/useMenuStore';
import type { NavigationResponse } from '@/shared/types/navigationMenuItem';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbEntry {
  title: string;
  url?: string;
  description?: string;
}

function buildBreadcrumbs(items: NavigationResponse, pathname: string): BreadcrumbEntry[] {
  if (pathname === APP_ROUTES.HOME)
    return [{ title: 'Dashboard', url: APP_ROUTES.HOME }];

  for (const item of items) {
    const subItem = item.sub_menu?.find((sub) => sub.url === pathname);
    if (subItem) {
      return [
        { title: 'Dashboard', url: APP_ROUTES.HOME },
        { title: item.name_menu },
        {
          title: subItem.name_sub_menu,
          url: subItem.url,
          description: subItem.description,
        },
      ];
    }
  }

  return [{ title: 'Dashboard', url: APP_ROUTES.HOME }];
}

export function AppHeader() {
  const location = useLocation();
  const navigationItems = useMenuStore((s) => s.items);
  const breadcrumbs = buildBreadcrumbs(navigationItems, location.pathname);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1].title;
  const pageDescription = breadcrumbs[breadcrumbs.length - 1]?.description ?? '-';

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-6 transition-all">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex flex-col">
        <div className="text-xl flex gap-2 items-center">
          <h1>{pageTitle}</h1>
        </div>
        <p className="text-sm"> {pageDescription}</p>
      </div>

      <Breadcrumb className="ml-auto hidden md:flex">
        <BreadcrumbList>
          {breadcrumbs.map((bc, index) => (
            <React.Fragment key={bc.title + index}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                ) : bc.url ? (
                  <BreadcrumbLink asChild>
                    <Link to={bc.url}>{bc.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground">{bc.title}</span>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
