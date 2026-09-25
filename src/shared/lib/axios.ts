import useAuthStore from '@/modules/auth/store/useAuthStore';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { USER_PERMISSIONS_QUERY_KEY } from '@/shared/hooks/useUserPermissions';
import { queryClient } from '@/shared/lib/react-query';
import axios, { type AxiosInstance } from 'axios';

const URL_API = import.meta.env.VITE_URL_API;

const getAxios = (timeout: number = 600000) => {
  const token = useAuthStore.getState().token;
  const instance: AxiosInstance = axios.create({
    baseURL: URL_API,
    timeout: timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (token && error?.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = APP_ROUTES.LOGIN;
      }
      if (token && error?.response?.status === 403) {
        queryClient.invalidateQueries({ queryKey: [USER_PERMISSIONS_QUERY_KEY] });
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export default getAxios;
