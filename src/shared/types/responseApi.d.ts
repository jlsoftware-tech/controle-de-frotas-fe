import type { TypeOptions } from "react-toastify";

export type ApiResponse<T> = {
  token?: string;
  data?: T;
  message: string;
  success: boolean;
  type?: TypeOptions | 'loading' | 'dismiss';
  error?: unknown;
};