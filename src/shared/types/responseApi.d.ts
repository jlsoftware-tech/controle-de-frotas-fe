import type { TypeOptions } from "react-toastify";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  type?: TypeOptions | 'loading' | 'dismiss';
  error?: unknown;
};