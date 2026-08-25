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
  LOGIN: '/login',
  FORGOT_PASSWORD: '/recuperar-senha',
  RESET_PASSWORD: '/redefinir-senha',
};

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
