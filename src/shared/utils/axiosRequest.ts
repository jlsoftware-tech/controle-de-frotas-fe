import getAxios from '@/shared/lib/axios';
import axios, { type AxiosInstance } from 'axios';
import type { ApiEnvelope, ApiResponse, ValidationErrors } from '../types/responseApi';

function handleError(err: unknown): ApiResponse<never> {
  if (axios.isAxiosError<Partial<ApiEnvelope<unknown>>>(err)) {
    const body = err.response?.data;
    const status = body?.status_code ?? err.response?.status;
    return {
      success: false,
      status_code: status,
      message: body?.message ?? 'Erro na requisição',
      errors: status === 422 ? (body?.data as ValidationErrors | undefined) : undefined,
      type: 'error',
    };
  }
  return {
    success: false,
    message: 'Erro inesperado',
    type: 'error',
  };
}

async function request<T>(call: (instance: AxiosInstance) => Promise<{ data: ApiEnvelope<T> }>): Promise<ApiResponse<T>> {
  try {
    const { data } = await call(getAxios());
    return {
      success: true,
      status_code: data.status_code,
      message: data.message,
      data: data.data ?? undefined,
      type: 'success',
    };
  } catch (err: unknown) {
    return handleError(err);
  }
}

export function getRequest<T>(url: string): Promise<ApiResponse<T>> {
  return request<T>((api) => api.get(url));
}

export function postRequest<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>((api) => api.post(url, body));
}

export function putRequest<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>((api) => api.put(url, body));
}

export function patchRequest<T = unknown>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>((api) => api.patch(url, body));
}

export function deleteRequest<T = unknown>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>((api) => api.delete(url, { data: body }));
}
