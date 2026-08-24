import React from 'react';
import { useLocation, Link } from 'react-router-dom';
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
import { ThemeToggle } from '../ThemeToggle';
import { NAVIGATION_ITEMS } from '@/shared/constants/navigation';

export function AppHeader() {
  const location = useLocation();

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

  if (breadcrumbs.length === 0) {
    breadcrumbs = [{ title: 'Dashboard', url: '/' }];
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/70 backdrop-blur-xl px-6 transition-all">
      <SidebarTrigger className="-ml-2 hover:bg-muted" />
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
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
