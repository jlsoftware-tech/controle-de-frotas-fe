import { Truck, Users, LayoutDashboard, Settings, Car, Wrench, Contact, CalendarClock } from 'lucide-react';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import type { ElementType } from 'react';

export interface NavigationSubItem {
  title: string;
  url: string;
  icon: ElementType;
}

export interface NavigationItem {
  title: string;
  url: string;
  icon: ElementType;
  items?: NavigationSubItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: APP_ROUTES.HOME,
    icon: LayoutDashboard,
  },
  {
    title: 'Veículos',
    url: APP_ROUTES.VEHICLES,
    icon: Truck,
    items: [
      {
        title: 'Meus Veículos',
        url: APP_ROUTES.MY_VEHICLES,
        icon: Car,
      },
      {
        title: 'Manutenção',
        url: APP_ROUTES.MAINTENANCE,
        icon: Wrench,
      },
    ],
  },
  {
    title: 'Motoristas',
    url: APP_ROUTES.DRIVERS,
    icon: Users,
    items: [
      {
        title: 'Lista de Motoristas',
        url: APP_ROUTES.DRIVERS_LIST,
        icon: Contact,
      },
      {
        title: 'Escalas',
        url: APP_ROUTES.SCHEDULES,
        icon: CalendarClock,
      },
    ],
  },
  {
    title: 'Configurações',
    url: APP_ROUTES.SETTINGS,
    icon: Settings,
  },
];
