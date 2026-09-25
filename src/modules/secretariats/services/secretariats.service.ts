import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type {
  CreateSecretariatPayload,
  GetSecretariatsParams,
  Secretariat,
  UpdateSecretariatPayload,
} from '../types/secretariat';
import type { PaginatedResponse } from '@/shared/types/responseApi';

export function getSecretariats(params?: GetSecretariatsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.order) query.append('order', params.order);

  const qs = query.toString();
  return getRequest<PaginatedResponse<Secretariat>>(`/secretariats${qs ? `?${qs}` : ''}`);
}

export function createSecretariat(data: CreateSecretariatPayload) {
  return postRequest<Secretariat>('secretariats', data);
}

export function updateSecretariat(id: number, data: UpdateSecretariatPayload) {
  return putRequest<Secretariat>(`secretariats/${id}`, data);
}

export function deleteSecretariat(id: number) {
  return deleteRequest(`secretariats/${id}`);
}
