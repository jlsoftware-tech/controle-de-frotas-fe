import { Truck, Users, LayoutDashboard, Settings, Car, Wrench, Contact, CalendarClock, UserCog } from 'lucide-react';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import type { NavigationItem } from '../types/navigationMenuItem';

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
        allowedRoles: ['ADMIN'],
      },
      {
        title: 'Escalas',
        url: APP_ROUTES.SCHEDULES,
        icon: CalendarClock,
        allowedRoles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Configurações',
    url: APP_ROUTES.SETTINGS,
    icon: Settings,
    allowedRoles: ['ADMIN'],
  },
  {
    title: 'Usuários',
    url: APP_ROUTES.USERS,
    icon: UserCog,
    allowedRoles: ['ADMIN'],
  },
];
