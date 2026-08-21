export const APP_ROUTES = {
  HOME: '/',
};

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
