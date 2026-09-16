export const APP_ROUTES = {
  HOME: '/',
  USERS: '/usuarios',
  PROFILES: '/perfis',
  SECRETARIATS: '/secretarias',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/recuperar-senha',
  RESET_PASSWORD: '/redefinir-senha',
};

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
