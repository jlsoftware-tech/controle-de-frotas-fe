import type { TypeOptions } from 'react-toastify';

export type ApiResponse<T> = {
  data?: T;
  message: string;
  success: boolean;
  type?: TypeOptions | 'loading' | 'dismiss';
  error?: unknown;
  status_code?: number;
};
