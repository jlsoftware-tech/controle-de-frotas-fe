export const APP_ROUTES = {
  HOME: '/',
  VEHICLES: '/veiculos',
  MY_VEHICLES: '/veiculos/meus',
  MAINTENANCE: '/veiculos/manutencao',
  DRIVERS: '/motoristas',
  DRIVERS_LIST: '/motoristas/lista',
  SCHEDULES: '/motoristas/escalas',
  SETTINGS: '/configuracoes',
  PROFILE: '/perfil',
};

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
